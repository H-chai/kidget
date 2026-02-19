import { Transaction } from '../types';

/** Calculates current balance from all transactions */
export const calculateBalance = (transactions: Transaction[]): number =>
  transactions.reduce(
    (acc, t) => (t.type === 'income' ? acc + t.amount : acc - t.amount),
    0
  );
