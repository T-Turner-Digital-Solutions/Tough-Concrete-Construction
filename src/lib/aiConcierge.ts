import { SERVICE_TYPES, DEFAULT_PRICING_RULES, type ServiceTypeKey } from '@/config/pricing';
import { calculateEstimate, type EstimateOptionalWork, type EstimateResult } from '@/lib/estimator';

export const PRELIMINARY_ESTIMATE_DISCLAIMER =
  'This preliminary estimate is based on the information provided and is not a binding quote. Final pricing is subject to site conditions, verified measurements, accessibility, material requirements, project specifications, and final approval by Tough Concrete Construction, LLC.';

export interface ConciergeAnswers {
  category: 'residential' | 'commercial' | null;
  serviceType: ServiceTypeKey | null;
  lengthFt: number | null;
  widthFt: number | null;
  thicknessIn: number | null;
  removalNeeded: boolean | null;
  desiredFinish: string | null;
  reinforcement: EstimateOptionalWork['reinforcement'] | null;
  accessNotes: string | null;
  propertyLocation: string | null;
}

export const BLANK_ANSWERS: ConciergeAnswers = {
  category: null,
  serviceType: null,
  lengthFt: null,
  widthFt: null,
  thicknessIn: null,
  removalNeeded: null,
  desiredFinish: null,
  reinforcement: null,
  accessNotes: null,
  propertyLocation: null,
};

export type ConciergeOutcome =
  | { status: 'incomplete' }
  | { status: 'site_inspection_required'; reasons: string[] }
  | { status: 'estimate'; result: EstimateResult; serviceLabel: string };

const SITE_INSPECTION_TRIGGERS: { test: (a: ConciergeAnswers) => boolean; reason: string }[] = [
  {
    test: (a) => !!a.serviceType && SERVICE_TYPES.find((s) => s.key === a.serviceType)?.requiresSiteInspection === true,
    reason: 'This project type involves structural, engineered, or complex-access work that requires professional review.',
  },
  {
    test: (a) => a.category === 'commercial',
    reason: 'Commercial specification work requires a site review to confirm code and load requirements.',
  },
  {
    test: (a) => !!a.accessNotes && /crane|tight|no access|narrow|steep|slope|grade change|retaining|drainage issue|water/i.test(a.accessNotes),
    reason: 'The access or grading details you described need to be verified on site.',
  },
  {
    test: (a) => (a.lengthFt ?? 0) * (a.widthFt ?? 0) > 2500,
    reason: 'Large-scale projects of this size are reviewed on site to confirm access, staging, and logistics.',
  },
];

/**
 * Evaluates the concierge conversation against Tough Concrete's own pricing
 * config. Never fabricates a number — either every required field is
 * present and a rule exists for the service type, or the customer is
 * routed to "Site Inspection Required" / owner review.
 */
export function evaluateConcierge(answers: ConciergeAnswers): ConciergeOutcome {
  const { category, serviceType, lengthFt, widthFt, thicknessIn } = answers;
  if (!category || !serviceType || !lengthFt || !widthFt || !thicknessIn) {
    return { status: 'incomplete' };
  }

  const triggered = SITE_INSPECTION_TRIGGERS.filter((t) => t.test(answers)).map((t) => t.reason);
  const serviceInfo = SERVICE_TYPES.find((s) => s.key === serviceType);

  if (triggered.length > 0 || !serviceInfo || serviceInfo.baseCostPerSqFt === null) {
    return {
      status: 'site_inspection_required',
      reasons: triggered.length > 0 ? triggered : ['No preliminary pricing rule is configured for this project type yet — a site or owner review is required.'],
    };
  }

  const result = calculateEstimate(
    {
      lengthFt,
      widthFt,
      thicknessIn,
      wastePercent: DEFAULT_PRICING_RULES.wastePercentDefault,
    },
    {
      removalNeeded: answers.removalNeeded ?? false,
      reinforcement: answers.reinforcement ?? 'wire_mesh',
      sealer: false,
      stamped: (answers.desiredFinish ?? '').toLowerCase().includes('stamp'),
      colored: (answers.desiredFinish ?? '').toLowerCase().includes('color'),
      pumpRequired: false,
      permitRequired: category === 'commercial',
    },
    DEFAULT_PRICING_RULES,
  );

  return { status: 'estimate', result, serviceLabel: serviceInfo.label };
}

export function serviceRequiresInspection(key: ServiceTypeKey): boolean {
  return SERVICE_TYPES.find((s) => s.key === key)?.requiresSiteInspection ?? true;
}
