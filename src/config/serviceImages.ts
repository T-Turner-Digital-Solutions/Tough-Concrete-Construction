import type { ServiceTypeKey } from '@/config/pricing';

/** Representative real-jobsite photo for each service type, used on ServiceCard tiles. */
export const SERVICE_IMAGES: Partial<Record<ServiceTypeKey, string>> = {
  driveway: '/gallery/flatwork-driveway-before-after.jpeg',
  driveway_extension: '/gallery/site-prep-driveway-extension.jpeg',
  patio: '/gallery/flatwork-patio-firepit-before-after.jpeg',
  sidewalk: '/gallery/flatwork-sidewalk-before-after.jpeg',
  walkway: '/gallery/flatwork-walkway-before-after.jpeg',
  slab: '/gallery/flatwork-backyard-slab-before-after.jpeg',
  foundation: '/gallery/structural-foundation.jpeg',
  parking_pad: '/gallery/parking-pad-brick-estate.jpeg',
  commercial: '/gallery/structural-commercial-entry.jpeg',
  removal: '/gallery/repair-removal-demolition.jpeg',
  replacement: '/gallery/flatwork-patio-before-after.jpeg',
  decorative: '/gallery/decorative-stamped-slate-patio.jpeg',
  stamped: '/gallery/decorative-stamped-driveway-cobble.jpeg',
  repair: '/gallery/process-crack-repair-steps.jpeg',
  steps: '/gallery/structural-steps.jpeg',
  retaining_wall: '/gallery/structural-retaining-wall-steps.jpeg',
  garage_slab: '/gallery/flatwork-garage-floor-before-after.jpeg',
  pool_deck: '/gallery/flatwork-pool-deck-before-after.jpeg',
  equipment_pad: '/gallery/structural-equipment-pad.jpeg',
  dumpster_pad: '/gallery/structural-dumpster-pad.jpeg',
  drainage: '/gallery/structural-drainage.jpeg',
  other: '/gallery/structural-other-utility-pad.jpeg',
};
