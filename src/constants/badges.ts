import type { BadgeDefinition } from '../types';
import { TiStarFullOutline } from 'react-icons/ti';
import { BsFire } from 'react-icons/bs';
import { IoMdTrophy } from 'react-icons/io';
import { FaMedal, FaCalendarAlt } from 'react-icons/fa';
import { GoGoal } from 'react-icons/go';
import { LuPartyPopper } from 'react-icons/lu';
import { FaMoneyBill1Wave } from 'react-icons/fa6';
import { MdSavings } from 'react-icons/md';
import { TbPigMoney } from 'react-icons/tb';

export const BADGE_DEFINITIONS: BadgeDefinition[] = [
  // ── Chore milestones ──────────────────────────────────────────
  {
    id: 'first_chore',
    emoji: TiStarFullOutline,
    color: '#ffc800',
    nameKey: 'badge.first_chore.name',
    descriptionKey: 'badge.first_chore.description',
  },
  {
    id: 'chore_5',
    emoji: IoMdTrophy,
    color: '#dcac00',
    count: 1,
    nameKey: 'badge.chore_5.name',
    descriptionKey: 'badge.chore_5.description',
  },
  {
    id: 'chore_15',
    emoji: IoMdTrophy,
    color: '#dcac00',
    count: 2,
    nameKey: 'badge.chore_15.name',
    descriptionKey: 'badge.chore_15.description',
  },
  {
    id: 'chore_50',
    emoji: IoMdTrophy,
    color: '#dcac00',
    count: 3,
    nameKey: 'badge.chore_50.name',
    descriptionKey: 'badge.chore_50.description',
  },
  {
    id: 'chore_100',
    emoji: FaMedal,
    color: '#fd4f4f',
    nameKey: 'badge.chore_100.name',
    descriptionKey: 'badge.chore_100.description',
  },
  // ── Streaks ───────────────────────────────────────────────────
  {
    id: 'chore_streak_7',
    emoji: BsFire,
    color: '#F18334',
    nameKey: 'badge.chore_streak_7.name',
    descriptionKey: 'badge.chore_streak_7.description',
  },
  {
    id: 'two_week_streak',
    emoji: BsFire,
    color: '#F18334',
    count: 2,
    nameKey: 'badge.two_week_streak.name',
    descriptionKey: 'badge.two_week_streak.description',
  },
  {
    id: 'monthly_habit',
    emoji: FaCalendarAlt,
    color: '#17b000',
    nameKey: 'badge.monthly_habit.name',
    descriptionKey: 'badge.monthly_habit.description',
  },
  // ── Goals ─────────────────────────────────────────────────────
  {
    id: 'first_goal',
    emoji: GoGoal,
    color: '#3C87D5',
    nameKey: 'badge.first_goal.name',
    descriptionKey: 'badge.first_goal.description',
  },
  {
    id: 'goal_achieved',
    emoji: LuPartyPopper,
    color: '#A057E0',
    nameKey: 'badge.goal_achieved.name',
    descriptionKey: 'badge.goal_achieved.description',
  },
  {
    id: 'second_goal_achieved',
    emoji: GoGoal,
    color: '#3C87D5',
    count: 2,
    nameKey: 'badge.second_goal_achieved.name',
    descriptionKey: 'badge.second_goal_achieved.description',
  },
  {
    id: 'goal_getter',
    emoji: GoGoal,
    color: '#3C87D5',
    count: 3,
    nameKey: 'badge.goal_getter.name',
    descriptionKey: 'badge.goal_getter.description',
  },
  {
    id: 'patient_saver',
    emoji: TbPigMoney,
    color: '#ff67a8',
    nameKey: 'badge.patient_saver.name',
    descriptionKey: 'badge.patient_saver.description',
  },
  // ── Spending ──────────────────────────────────────────────────
  {
    id: 'first_expense',
    emoji: FaMoneyBill1Wave,
    color: '#1EB400',
    nameKey: 'badge.first_expense.name',
    descriptionKey: 'badge.first_expense.description',
  },
  {
    id: 'saver_month',
    emoji: MdSavings,
    color: '#ff67a8',
    nameKey: 'badge.saver_month.name',
    descriptionKey: 'badge.saver_month.description',
  },
  {
    id: 'no_expense_2months',
    emoji: MdSavings,
    color: '#ff67a8',
    count: 2,
    nameKey: 'badge.no_expense_2months.name',
    descriptionKey: 'badge.no_expense_2months.description',
  },
];
