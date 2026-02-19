import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Transaction } from '../types';

type UseTransactionsResult = {
  transactions: Transaction[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

/** Fetches all transactions for the given user, ordered by date descending */
export const useTransactions = (userId: string): UseTransactionsResult => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setTransactions((data as Transaction[]) ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { transactions, loading, error, refetch: fetch };
};
