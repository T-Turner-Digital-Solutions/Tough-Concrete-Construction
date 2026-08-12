/**
 * Owner-configurable pricing rules that drive both the Estimating engine
 * and the AI Concierge's preliminary estimates. In production this is
 * stored in the `pricing_rules` table and edited from
 * Admin → Settings → Concrete/Labor/Material Pricing. These are the
 * fallback/demo defaults.
 *
 * The AI Concierge is only ever allowed to read this config — it must
 * never invent a price for a service type that isn't listed here.
 */

export type ServiceTypeKey =
  | 'driveway'
  | 'driveway_extension'
  | 'patio'
  | 'sidewalk'
  | 'walkway'
  | 'slab'
  | 'foundation'
  | 'parking_pad'
  | 'commercial'
  | 'removal'
  | 'replacement'
  | 'decorative'
  | 'stamped'
  | 'repair'
  | 'steps'
  | 'retaining_wall'
  | 'garage_slab'
  | 'pool_deck'
  | 'equipment_pad'
  | 'dumpster_pad'
  | 'drainage'
  | 'other';

export interface ServiceTypeInfo {
  key: ServiceTypeKey;
  label: string;
  shortDescription: string;
  /** If true, AI concierge must always route to "Site Inspection Required" and skip preliminary pricing. */
  requiresSiteInspection: boolean;
  /** Base cost per square foot used for AI/quick preliminary math. Null = no rule configured yet. */
  baseCostPerSqFt: number | null;
  defaultThicknessInches: number;
  icon: string;
}

export const SERVICE_TYPES: ServiceTypeInfo[] = [
  { key: 'driveway', label: 'Concrete Driveways', shortDescription: 'New driveways poured to last, sized to fit your vehicles and lot.', requiresSiteInspection: false, baseCostPerSqFt: 8.5, defaultThicknessInches: 4, icon: 'driveway' },
  { key: 'driveway_extension', label: 'Driveway Extensions', shortDescription: 'Add parking space or widen an existing driveway.', requiresSiteInspection: false, baseCostPerSqFt: 9, defaultThicknessInches: 4, icon: 'driveway' },
  { key: 'patio', label: 'Concrete Patios', shortDescription: 'Outdoor living space built for entertaining and everyday life.', requiresSiteInspection: false, baseCostPerSqFt: 9.5, defaultThicknessInches: 4, icon: 'patio' },
  { key: 'sidewalk', label: 'Sidewalks', shortDescription: 'Durable, code-compliant sidewalks for homes and businesses.', requiresSiteInspection: false, baseCostPerSqFt: 7.5, defaultThicknessInches: 4, icon: 'sidewalk' },
  { key: 'walkway', label: 'Walkways', shortDescription: 'Connect your home, garden, and outdoor spaces.', requiresSiteInspection: false, baseCostPerSqFt: 7.5, defaultThicknessInches: 4, icon: 'walkway' },
  { key: 'slab', label: 'Concrete Slabs', shortDescription: 'Flat work slabs for sheds, workshops, and general use.', requiresSiteInspection: false, baseCostPerSqFt: 7, defaultThicknessInches: 4, icon: 'slab' },
  { key: 'foundation', label: 'Foundations', shortDescription: 'Structural foundation work — requires engineering review.', requiresSiteInspection: true, baseCostPerSqFt: null, defaultThicknessInches: 6, icon: 'foundation' },
  { key: 'parking_pad', label: 'Parking Pads', shortDescription: 'Reinforced pads for extra vehicle or RV parking.', requiresSiteInspection: false, baseCostPerSqFt: 8.75, defaultThicknessInches: 5, icon: 'parking' },
  { key: 'commercial', label: 'Commercial Concrete', shortDescription: 'Commercial slabs, pads, and flatwork to spec.', requiresSiteInspection: true, baseCostPerSqFt: null, defaultThicknessInches: 5, icon: 'commercial' },
  { key: 'removal', label: 'Concrete Removal', shortDescription: 'Demo and haul-off of existing concrete.', requiresSiteInspection: false, baseCostPerSqFt: 3.25, defaultThicknessInches: 4, icon: 'removal' },
  { key: 'replacement', label: 'Concrete Replacement', shortDescription: 'Remove and replace failing concrete.', requiresSiteInspection: false, baseCostPerSqFt: 10.5, defaultThicknessInches: 4, icon: 'replacement' },
  { key: 'decorative', label: 'Decorative Concrete', shortDescription: 'Color, texture, and pattern upgrades.', requiresSiteInspection: false, baseCostPerSqFt: 12, defaultThicknessInches: 4, icon: 'decorative' },
  { key: 'stamped', label: 'Stamped Concrete', shortDescription: 'Stone, brick, or slate-look stamped patterns.', requiresSiteInspection: false, baseCostPerSqFt: 14, defaultThicknessInches: 4, icon: 'stamped' },
  { key: 'repair', label: 'Concrete Repair', shortDescription: 'Crack repair, mudjacking referral, and resurfacing.', requiresSiteInspection: false, baseCostPerSqFt: 6, defaultThicknessInches: 4, icon: 'repair' },
  { key: 'steps', label: 'Concrete Steps', shortDescription: 'Entry steps and stoops built to code.', requiresSiteInspection: true, baseCostPerSqFt: null, defaultThicknessInches: 4, icon: 'steps' },
  { key: 'retaining_wall', label: 'Retaining Walls', shortDescription: 'Structural retaining walls for grade changes.', requiresSiteInspection: true, baseCostPerSqFt: null, defaultThicknessInches: 8, icon: 'wall' },
  { key: 'garage_slab', label: 'Garage Slabs', shortDescription: 'New or replacement garage floor slabs.', requiresSiteInspection: false, baseCostPerSqFt: 8, defaultThicknessInches: 4, icon: 'garage' },
  { key: 'pool_deck', label: 'Pool Decks', shortDescription: 'Slip-resistant decorative decking around pools.', requiresSiteInspection: false, baseCostPerSqFt: 13, defaultThicknessInches: 4, icon: 'pool' },
  { key: 'equipment_pad', label: 'Equipment Pads', shortDescription: 'HVAC, generator, and equipment pads.', requiresSiteInspection: false, baseCostPerSqFt: 8, defaultThicknessInches: 4, icon: 'equipment' },
  { key: 'dumpster_pad', label: 'Dumpster Pads', shortDescription: 'Heavy-duty commercial dumpster pads.', requiresSiteInspection: true, baseCostPerSqFt: null, defaultThicknessInches: 6, icon: 'dumpster' },
  { key: 'drainage', label: 'Drainage-Related Concrete', shortDescription: 'Swales, flumes, and drainage-tied flatwork.', requiresSiteInspection: true, baseCostPerSqFt: null, defaultThicknessInches: 4, icon: 'drainage' },
  { key: 'other', label: 'Other Custom Concrete Work', shortDescription: "Don't see your project? Tell us about it.", requiresSiteInspection: true, baseCostPerSqFt: null, defaultThicknessInches: 4, icon: 'other' },
];

export interface PricingRules {
  concreteCostPerCubicYard: number;
  laborCostPerSqFt: number;
  excavationCostPerSqFt: number;
  demolitionCostPerSqFt: number;
  gravelBaseCostPerSqFt: number;
  rebarCostPerSqFt: number;
  wireMeshCostPerSqFt: number;
  fiberCostPerCubicYard: number;
  formsCostPerLinearFt: number;
  pumpFeeFlat: number;
  equipmentFeeFlat: number;
  haulingCostPerCubicYard: number;
  disposalCostPerSqFt: number;
  finishingCostPerSqFt: number;
  sealerCostPerSqFt: number;
  stampingCostPerSqFt: number;
  coloringCostPerSqFt: number;
  travelFeeFlat: number;
  permitAllowanceFlat: number;
  wastePercentDefault: number;
  markupPercentDefault: number;
  minimumProjectCharge: number;
  salesTaxPercent: number;
  estimateValidDays: number;
  depositPercent: number;
}

export const DEFAULT_PRICING_RULES: PricingRules = {
  concreteCostPerCubicYard: 165,
  laborCostPerSqFt: 2.75,
  excavationCostPerSqFt: 1.1,
  demolitionCostPerSqFt: 3.25,
  gravelBaseCostPerSqFt: 0.85,
  rebarCostPerSqFt: 0.65,
  wireMeshCostPerSqFt: 0.4,
  fiberCostPerCubicYard: 12,
  formsCostPerLinearFt: 2.5,
  pumpFeeFlat: 450,
  equipmentFeeFlat: 300,
  haulingCostPerCubicYard: 18,
  disposalCostPerSqFt: 0.5,
  finishingCostPerSqFt: 1.25,
  sealerCostPerSqFt: 0.6,
  stampingCostPerSqFt: 3.5,
  coloringCostPerSqFt: 1.75,
  travelFeeFlat: 0,
  permitAllowanceFlat: 150,
  wastePercentDefault: 8,
  markupPercentDefault: 22,
  minimumProjectCharge: 1800,
  salesTaxPercent: 8.25,
  estimateValidDays: 30,
  depositPercent: 30,
};
