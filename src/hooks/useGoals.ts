import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Goal } from '../types';

type UseGoalsResult = {
  goals: Goal[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

/** Fetches all goals for the given user, ordered by creation date descending */
export const useGoals = (userId: string): UseGoalsResult => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setGoals((data as Goal[]) ?? []);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { goals, loading, error, refetch: fetch };
};
