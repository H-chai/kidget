import type { LevelThreshold } from '../types';

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, minChores: 0 },
  { level: 2, minChores: 10 },
  { level: 3, minChores: 30 },
  { level: 4, minChores: 60 },
  { level: 5, minChores: 100 },
];

export const MAX_LEVEL = 5;
