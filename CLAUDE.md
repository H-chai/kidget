# Kidget — Claude Code Instructions

## Project

PWA allowance tracker for kids. Children record chores (income) and expenses, track savings goals, and earn badges/level up.

## Tech Stack

- React + TypeScript (strict mode)
- Vite + vite-plugin-pwa
- Supabase (auth + PostgreSQL)
- Recharts (charts)
- i18next + react-i18next (i18n)
- Vercel (deployment)

## Code Style

- Arrow functions only — no `function` declarations
- `const` over `let`
- No `any` type
- Named exports only — no default exports
- Small, single-responsibility functions
- JSDoc for exported functions
- Comments only when logic is non-obvious

## Internationalization

- All UI text via i18next keys — never hardcode strings in components
- Use `t('key')` pattern throughout
- Translation files live in `src/i18n/` (start with `en.json`)

## Data Rules

- Currency is integer (whole units — yen, kr, etc.) — no decimals
- Balance is always computed from transaction history, never stored
- Level is computed from chore count (income transactions), never stored

## Folder Structure

```
src/
├── components/
│   ├── ui/        # Button, Card, ProgressBar, etc.
│   └── layout/    # BottomNav, FAB, page layout
├── pages/
│   ├── Overview/
│   ├── History/
│   ├── AddTransaction/
│   ├── Badges/
│   └── Goals/
├── hooks/         # Custom React hooks
├── lib/           # Supabase client setup
├── types/         # TypeScript type definitions
├── constants/     # Badge definitions, level thresholds
├── utils/         # Pure functions (balance, level, badge checks)
└── i18n/          # Translation files
```

## TypeScript Types (src/types/)

```ts
type TransactionType = "income" | "expense";

type Transaction = {
  id: string;
  user_id: string;
  type: TransactionType;
  amount: number; // integer
  description: string;
  date: string; // YYYY-MM-DD
  created_at: string; // ISO 8601
};

type Goal = {
  id: string;
  user_id: string;
  title: string;
  target_amount: number; // integer
  created_at: string;
  achieved_at: string | null;
};

type Badge = {
  id: string;
  user_id: string;
  badge_id: string;
  achieved_at: string;
};

type Profile = {
  user_id: string;
  name: string;
  avatar_emoji: string;
};
```

## Level System (src/constants/)

| Level | Chores Required |
| ----- | --------------- |
| Lv 1  | 0+              |
| Lv 2  | 10+             |
| Lv 3  | 30+             |
| Lv 4  | 60+             |
| Lv 5  | 100+            |

## Badge Definitions (src/constants/)

| badge_id       | Condition                         |
| -------------- | --------------------------------- |
| first_chore    | First income transaction recorded |
| chore_10       | 10 chores completed               |
| chore_streak_7 | Chores on 7 consecutive days      |
| first_goal     | First savings goal created        |
| goal_achieved  | First savings goal achieved       |
| first_expense  | First expense recorded            |
| saver_month    | Zero expenses in a calendar month |

## Supabase

- Tables: `transactions`, `goals`, `badges`, `profiles`
- RLS enabled on all tables — users access only their own data
- Auth: email + password via Supabase Auth
- Session persists automatically — no repeated logins

## Screen Layout

Bottom nav: `[ Overview ] [ History ] [ (+) FAB ] [ Badges ] [ Goals ]`

### Overview

- Current balance (prominent)
- Active savings goal progress
- Last 5 transactions
- Level progress indicator

### History

- Full transaction list, filterable by month

### Add Transaction (FAB)

- Type: Income (chore) or Expense
- Fields: description, amount, date

### Badges & Level

- Current level + progress to next
- Badge grid: earned (colored) / unearned (greyed out)

### Goals

- List of savings goals with progress bars
- Create / edit goals

---

## Before Deploy — Checklist

**IMPORTANT: When the user asks to deploy or push to Vercel, stop and go through this checklist first.**

- [ ] Supabase Authentication → Providers → Email → **"Confirm email" が ON になっているか確認**
- [ ] Vercel の環境変数に `VITE_SUPABASE_URL` と `VITE_SUPABASE_ANON_KEY` を設定済みか確認
- [ ] Supabase SQL（テーブル作成・RLS ポリシー）を本番プロジェクトで実行済みか確認
- [ ] `vite.config.ts` に PWA manifest の設定が入っているか確認
- [ ] `vercel.json` に SPA ルーティング用のリダイレクト設定が入っているか確認
