import type { LevelThreshold } from '../types';

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1,  minChores: 0   },
  { level: 2,  minChores: 3   },
  { level: 3,  minChores: 8   },
  { level: 4,  minChores: 15  },
  { level: 5,  minChores: 24  },
  { level: 6,  minChores: 35  },
  { level: 7,  minChores: 48  },
  { level: 8,  minChores: 63  },
  { level: 9,  minChores: 80  },
  { level: 10, minChores: 100 },
];

export const MAX_LEVEL = 10;
