import { LEVEL_THRESHOLDS, MAX_LEVEL } from '../constants';

/** Returns the current level (1–5) based on number of chores completed */
export const calculateLevel = (choreCount: number): number => {
  let level = 1;
  for (const threshold of LEVEL_THRESHOLDS) {
    if (choreCount >= threshold.minChores) level = threshold.level;
  }
  return level;
};

/** Returns chores needed to reach the next level, or null if at max level */
export const choresToNextLevel = (choreCount: number): number | null => {
  const currentLevel = calculateLevel(choreCount);
  if (currentLevel >= MAX_LEVEL) return null;
  const next = LEVEL_THRESHOLDS.find(t => t.level === currentLevel + 1);
  return next ? next.minChores - choreCount : null;
};
