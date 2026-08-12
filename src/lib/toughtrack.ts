import type { StageTemplate } from '@/config/stages';

export interface JobStageProgress {
  key: string;
  label: string;
  status: 'pending' | 'in_progress' | 'complete' | 'skipped';
  /** 0-100 within this stage; only meaningful when status === 'in_progress'. */
  percentWithinStage: number;
  startedAt?: string;
  completedAt?: string;
}

/**
 * Computes the single "ToughTrack overall % complete" number shown to
 * customers. Owners/crew never type a percentage directly — it is always
 * derived from stage weights + which stages are complete/in-progress, so
 * the number can't drift from reality.
 */
export function calculateOverallProgress(
  stages: StageTemplate[],
  progress: JobStageProgress[],
): number {
  const activeStages = stages.filter((s) => {
    const p = progress.find((pr) => pr.key === s.key);
    return p?.status !== 'skipped';
  });
  const totalWeight = activeStages.reduce((sum, s) => sum + s.weight, 0);
  if (totalWeight === 0) return 0;

  let completedWeight = 0;
  for (const stage of activeStages) {
    const p = progress.find((pr) => pr.key === stage.key);
    if (!p) continue;
    if (p.status === 'complete') {
      completedWeight += stage.weight;
    } else if (p.status === 'in_progress') {
      completedWeight += stage.weight * (p.percentWithinStage / 100);
    }
  }

  return Math.round((completedWeight / totalWeight) * 100);
}

export function getCurrentStage(
  stages: StageTemplate[],
  progress: JobStageProgress[],
): StageTemplate | null {
  for (const stage of stages) {
    const p = progress.find((pr) => pr.key === stage.key);
    if (p?.status === 'in_progress') return stage;
  }
  // Nothing explicitly in_progress — find the first pending stage after the last complete one.
  const firstPending = stages.find((s) => {
    const p = progress.find((pr) => pr.key === s.key);
    return !p || p.status === 'pending';
  });
  return firstPending ?? stages[stages.length - 1] ?? null;
}

export function getCompletedStages(stages: StageTemplate[], progress: JobStageProgress[]): StageTemplate[] {
  return stages.filter((s) => progress.find((p) => p.key === s.key)?.status === 'complete');
}

export function getUpcomingStages(stages: StageTemplate[], progress: JobStageProgress[]): StageTemplate[] {
  const current = getCurrentStage(stages, progress);
  const currentIndex = current ? stages.findIndex((s) => s.key === current.key) : -1;
  return stages.filter((s, i) => {
    if (i <= currentIndex) return false;
    return progress.find((p) => p.key === s.key)?.status !== 'skipped';
  });
}
