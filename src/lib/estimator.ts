import type { PricingRules } from '@/config/pricing';

export interface EstimateMeasurements {
  lengthFt: number;
  widthFt: number;
  thicknessIn: number;
  wastePercent: number;
  perimeterFt?: number;
}

export interface EstimateOptionalWork {
  removalNeeded: boolean;
  reinforcement: 'none' | 'wire_mesh' | 'rebar' | 'fiber';
  sealer: boolean;
  stamped: boolean;
  colored: boolean;
  pumpRequired: boolean;
  permitRequired: boolean;
}

export interface EstimateLineItem {
  key: string;
  label: string;
  amount: number;
  category: 'material' | 'labor' | 'equipment' | 'other';
}

export interface EstimateResult {
  squareFootage: number;
  cubicYardsNeeded: number;
  cubicYardsWithWaste: number;
  lineItems: EstimateLineItem[];
  subtotal: number;
  markupAmount: number;
  taxAmount: number;
  total: number;
  minimumChargeApplied: boolean;
  depositAmount: number;
}

export function calcSquareFootage(m: EstimateMeasurements): number {
  return round2(m.lengthFt * m.widthFt);
}

export function calcCubicYards(m: EstimateMeasurements): { needed: number; withWaste: number } {
  const sqft = calcSquareFootage(m);
  const cubicFeet = sqft * (m.thicknessIn / 12);
  const needed = cubicFeet / 27;
  const withWaste = needed * (1 + m.wastePercent / 100);
  return { needed: round2(needed), withWaste: round2(withWaste) };
}

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Core concrete estimate calculator. Pure function — no I/O — so it can be
 * unit tested, reused by the admin Estimate Builder, and reused (in a
 * restricted read-only fashion) by the AI Concierge for preliminary
 * pricing. Every dollar figure traces back to `pricing` (owner-configured)
 * or an explicit manual override; nothing is invented.
 */
export function calculateEstimate(
  measurements: EstimateMeasurements,
  optional: EstimateOptionalWork,
  pricing: PricingRules,
  overrides?: { markupPercent?: number; manualTotal?: number },
): EstimateResult {
  const sqft = calcSquareFootage(measurements);
  const { needed, withWaste } = calcCubicYards(measurements);
  const perimeter = measurements.perimeterFt ?? estimatePerimeter(measurements);

  const lineItems: EstimateLineItem[] = [];
  const push = (key: string, label: string, amount: number, category: EstimateLineItem['category']) => {
    if (amount > 0) lineItems.push({ key, label, amount: round2(amount), category });
  };

  push('concrete', 'Concrete material', withWaste * pricing.concreteCostPerCubicYard, 'material');
  push('labor', 'Labor', sqft * pricing.laborCostPerSqFt, 'labor');
  push('base', 'Gravel / base preparation', sqft * pricing.gravelBaseCostPerSqFt, 'material');
  push('forms', 'Forms', perimeter * pricing.formsCostPerLinearFt, 'material');
  push('finishing', 'Finishing', sqft * pricing.finishingCostPerSqFt, 'labor');
  push('hauling', 'Hauling', withWaste * pricing.haulingCostPerCubicYard, 'other');
  push('permit', 'Permit allowance', optional.permitRequired ? pricing.permitAllowanceFlat : 0, 'other');
  push('travel', 'Travel', pricing.travelFeeFlat, 'other');

  if (optional.removalNeeded) {
    push('demo', 'Existing concrete removal & disposal', sqft * (pricing.demolitionCostPerSqFt + pricing.disposalCostPerSqFt), 'labor');
  }

  if (optional.reinforcement === 'rebar') {
    push('rebar', 'Rebar reinforcement', sqft * pricing.rebarCostPerSqFt, 'material');
  } else if (optional.reinforcement === 'wire_mesh') {
    push('wire_mesh', 'Wire mesh reinforcement', sqft * pricing.wireMeshCostPerSqFt, 'material');
  } else if (optional.reinforcement === 'fiber') {
    push('fiber', 'Fiber reinforcement', withWaste * pricing.fiberCostPerCubicYard, 'material');
  }

  if (optional.pumpRequired) push('pump', 'Concrete pump fee', pricing.pumpFeeFlat, 'equipment');
  if (optional.sealer) push('sealer', 'Sealer application', sqft * pricing.sealerCostPerSqFt, 'labor');
  if (optional.stamped) push('stamping', 'Stamped pattern', sqft * pricing.stampingCostPerSqFt, 'labor');
  if (optional.colored) push('coloring', 'Integral coloring', sqft * pricing.coloringCostPerSqFt, 'material');

  const rawSubtotal = lineItems.reduce((sum, li) => sum + li.amount, 0);
  const markupPercent = overrides?.markupPercent ?? pricing.markupPercentDefault;
  const markupAmount = round2(rawSubtotal * (markupPercent / 100));
  let subtotalWithMarkup = rawSubtotal + markupAmount;

  let minimumChargeApplied = false;
  if (subtotalWithMarkup < pricing.minimumProjectCharge) {
    subtotalWithMarkup = pricing.minimumProjectCharge;
    minimumChargeApplied = true;
  }

  const taxAmount = round2(subtotalWithMarkup * (pricing.salesTaxPercent / 100));
  let total = round2(subtotalWithMarkup + taxAmount);

  if (typeof overrides?.manualTotal === 'number' && overrides.manualTotal > 0) {
    total = round2(overrides.manualTotal);
  }

  return {
    squareFootage: sqft,
    cubicYardsNeeded: needed,
    cubicYardsWithWaste: withWaste,
    lineItems,
    subtotal: round2(rawSubtotal),
    markupAmount,
    taxAmount,
    total,
    minimumChargeApplied,
    depositAmount: round2(total * (pricing.depositPercent / 100)),
  };
}

function estimatePerimeter(m: EstimateMeasurements): number {
  return round2(2 * (m.lengthFt + m.widthFt));
}
