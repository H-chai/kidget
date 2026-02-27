import type { Transaction, Goal } from '../types';

/** Returns badge IDs that should be earned given the current data */
export const checkEarnedBadgeIds = (
  transactions: Transaction[],
  goals: Goal[]
): string[] => {
  const earned: string[] = [];
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');
  const achievedGoals = goals.filter(g => g.achieved_at !== null);

  // Chore milestones
  if (incomes.length >= 1)   earned.push('first_chore');
  if (incomes.length >= 5)   earned.push('chore_5');
  if (incomes.length >= 15)  earned.push('chore_15');
  if (incomes.length >= 50)  earned.push('chore_50');
  if (incomes.length >= 100) earned.push('chore_100');

  // Streaks
  if (hasChoreStreak(incomes, 7))  earned.push('chore_streak_7');
  if (hasChoreStreak(incomes, 14)) earned.push('two_week_streak');
  if (hasChoreStreak(incomes, 30)) earned.push('monthly_habit');

  // Goals
  if (goals.length >= 1)              earned.push('first_goal');
  if (achievedGoals.length >= 1)      earned.push('goal_achieved');
  if (achievedGoals.length >= 2)      earned.push('second_goal_achieved');
  if (achievedGoals.length >= 3)      earned.push('goal_getter');
  if (hasPatientSaver(achievedGoals)) earned.push('patient_saver');

  // Spending
  if (expenses.length >= 1)                earned.push('first_expense');
  if (hasSaverMonth(transactions))         earned.push('saver_month');
  if (hasNoExpenseMonths(transactions, 2)) earned.push('no_expense_2months');

  return earned;
};

const hasChoreStreak = (incomes: Transaction[], days: number): boolean => {
  if (incomes.length < days) return false;
  const uniqueDates = [...new Set(incomes.map(t => t.date))].sort();
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff =
      (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i - 1]).getTime()) /
      86_400_000;
    if (diff === 1) {
      streak++;
      if (streak >= days) return true;
    } else {
      streak = 1;
    }
  }
  return false;
};

/** Returns true if any calendar month has income but zero expenses */
const hasSaverMonth = (transactions: Transaction[]): boolean => {
  const incomeMonths = new Set(
    transactions.filter(t => t.type === 'income').map(t => t.date.slice(0, 7))
  );
  const expenseMonths = new Set(
    transactions.filter(t => t.type === 'expense').map(t => t.date.slice(0, 7))
  );
  for (const month of incomeMonths) {
    if (!expenseMonths.has(month)) return true;
  }
  return false;
};

/** Returns true if at least `count` distinct months have income but zero expenses */
const hasNoExpenseMonths = (transactions: Transaction[], count: number): boolean => {
  const incomeMonths = new Set(
    transactions.filter(t => t.type === 'income').map(t => t.date.slice(0, 7))
  );
  const expenseMonths = new Set(
    transactions.filter(t => t.type === 'expense').map(t => t.date.slice(0, 7))
  );
  let saverMonthCount = 0;
  for (const month of incomeMonths) {
    if (!expenseMonths.has(month)) saverMonthCount++;
  }
  return saverMonthCount >= count;
};

/** Returns true if any achieved goal took 30+ days from creation to achievement */
const hasPatientSaver = (achievedGoals: Goal[]): boolean => {
  return achievedGoals.some(g => {
    if (!g.achieved_at) return false;
    const days =
      (new Date(g.achieved_at).getTime() - new Date(g.created_at).getTime()) /
      86_400_000;
    return days >= 30;
  });
};
