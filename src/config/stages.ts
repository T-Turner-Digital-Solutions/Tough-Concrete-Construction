/**
 * Default ToughTrack™ stage template. Jobs copy this list into
 * `job_stages` at creation time and can reorder/rename/add/remove stages
 * per job from Admin → Job → ToughTrack Setup. Overall percent-complete is
 * always derived from stage weights + task completion — never hand-typed.
 */
export interface StageTemplate {
  key: string;
  label: string;
  description: string;
  /** Relative weight used to compute overall % complete. Weights need not sum to 100. */
  weight: number;
  customerCopy: {
    whatHappens: string;
    whatToExpect: string;
  };
}

export const DEFAULT_TOUGHTRACK_STAGES: StageTemplate[] = [
  {
    key: 'estimate_approved',
    label: 'Estimate Approved',
    description: 'Customer approved the estimate.',
    weight: 4,
    customerCopy: {
      whatHappens: 'Your estimate has been approved and your project has officially started.',
      whatToExpect: "We'll prepare your contract and deposit invoice next.",
    },
  },
  {
    key: 'contract_signed',
    label: 'Contract Signed',
    description: 'Construction contract executed by both parties.',
    weight: 4,
    customerCopy: {
      whatHappens: 'Your construction contract has been signed by you and Tough Concrete Construction.',
      whatToExpect: "We'll get your job on the schedule and confirm a start window.",
    },
  },
  {
    key: 'scheduled',
    label: 'Scheduled',
    description: 'Job placed on the production calendar.',
    weight: 5,
    customerCopy: {
      whatHappens: 'Your project has a confirmed spot on our production schedule.',
      whatToExpect: "We'll notify you a few days before crew mobilization with a firm start date.",
    },
  },
  {
    key: 'site_prep',
    label: 'Site Preparation',
    description: 'Site protected, staged, and marked for utilities.',
    weight: 8,
    customerCopy: {
      whatHappens: 'Our crew is protecting nearby surfaces, staging equipment, and marking utility lines.',
      whatToExpect: 'Some noise and equipment staging near the work area is normal during this stage.',
    },
  },
  {
    key: 'excavation',
    label: 'Excavation',
    description: 'Old material removed and subgrade excavated to depth.',
    weight: 12,
    customerCopy: {
      whatHappens: 'Crew is excavating and hauling material to reach proper subgrade depth.',
      whatToExpect: 'You may see excavation equipment and haul trucks on site.',
    },
  },
  {
    key: 'base_prep',
    label: 'Base Preparation',
    description: 'Gravel base placed and compacted.',
    weight: 10,
    customerCopy: {
      whatHappens: 'A compacted gravel base is being placed to support the concrete.',
      whatToExpect: "You'll hear a plate compactor running during this stage.",
    },
  },
  {
    key: 'forms',
    label: 'Forms',
    description: 'Form boards set to define edges and elevations.',
    weight: 8,
    customerCopy: {
      whatHappens: 'Form boards are being set to define the exact shape and elevation of your concrete.',
      whatToExpect: 'Wood or metal forms will be visible around the work area — this is normal and temporary.',
    },
  },
  {
    key: 'reinforcement',
    label: 'Reinforcement',
    description: 'Rebar and/or wire mesh placed per spec.',
    weight: 8,
    customerCopy: {
      whatHappens: 'Rebar and/or wire mesh reinforcement is being placed inside the forms.',
      whatToExpect: 'The area will look ready to pour soon.',
    },
  },
  {
    key: 'inspection',
    label: 'Inspection',
    description: 'Municipal or engineering inspection if required.',
    weight: 3,
    customerCopy: {
      whatHappens: 'If required for your project, an inspector is reviewing the prep work before pour day.',
      whatToExpect: "This stage is skipped automatically if an inspection isn't required.",
    },
  },
  {
    key: 'pour',
    label: 'Concrete Pour',
    description: 'Concrete delivered, placed, and screeded.',
    weight: 16,
    customerCopy: {
      whatHappens: "It's pour day! Concrete trucks will deliver and our crew will place, screed, and float the concrete.",
      whatToExpect: 'Expect trucks on site for several hours depending on job size.',
    },
  },
  {
    key: 'finishing',
    label: 'Finishing',
    description: 'Surface finish, edging, joints, and any decorative work.',
    weight: 10,
    customerCopy: {
      whatHappens: 'Crew is applying your chosen finish, cutting control joints, and edging.',
      whatToExpect: 'Please stay off the fresh concrete — we will let you know exactly when it is safe to walk on.',
    },
  },
  {
    key: 'curing',
    label: 'Curing',
    description: 'Concrete curing before opening to foot/vehicle traffic.',
    weight: 6,
    customerCopy: {
      whatHappens: 'Your new concrete is curing and gaining strength.',
      whatToExpect: 'Avoid foot traffic for 24–48 hours and vehicle traffic for 7+ days unless told otherwise.',
    },
  },
  {
    key: 'cleanup',
    label: 'Cleanup',
    description: 'Site cleanup, form removal, and debris haul-off.',
    weight: 3,
    customerCopy: {
      whatHappens: 'Forms are being removed and the site is being cleaned and restored.',
      whatToExpect: "We'll haul away debris and leave the surrounding area clean.",
    },
  },
  {
    key: 'final_inspection',
    label: 'Final Inspection',
    description: 'Quality walkthrough before handoff.',
    weight: 2,
    customerCopy: {
      whatHappens: 'Our team is doing a final quality walkthrough of the finished work.',
      whatToExpect: "We'll flag anything that needs touch-up before marking the job complete.",
    },
  },
  {
    key: 'complete',
    label: 'Complete',
    description: 'Project complete and handed off to the customer.',
    weight: 1,
    customerCopy: {
      whatHappens: 'Your project is complete! Thank you for choosing Tough Concrete Construction.',
      whatToExpect: "You'll receive your final invoice and warranty information.",
    },
  },
];

export const stageWeightTotal = DEFAULT_TOUGHTRACK_STAGES.reduce((sum, s) => sum + s.weight, 0);
