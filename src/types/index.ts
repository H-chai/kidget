import type { ComponentType } from 'react';

export type TransactionType = 'income' | 'expense';

export type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number; // integer (whole units — yen, kr, etc.)
  description: string;
  date: string; // YYYY-MM-DD
  icon: string | null;
  created_at: string; // ISO 8601
};

export type Goal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number; // integer
  created_at: string;
  achieved_at: string | null; // null if not yet achieved
};

export type Badge = {
  id: string;
  user_id: string;
  badge_id: string;
  achieved_at: string;
};

export type Profile = {
  user_id: string;
  name: string;
  avatar_emoji: string;
};

/** Badge definition — stored as constant, not in DB */
export type BadgeDefinition = {
  id: string;
  emoji: ComponentType<{ size?: number; className?: string }>;
  color: string;
  count?: number; // number of icons to show side by side, default 1
  nameKey: string; // i18n key
  descriptionKey: string; // i18n key
};

/** Level threshold entry */
export type LevelThreshold = {
  level: number;
  minChores: number;
};
