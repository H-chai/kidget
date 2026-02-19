import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Badge } from '../types';

type UseBadgesResult = {
  badges: Badge[];
  loading: boolean;
  refetch: () => void;
};

/** Fetches all earned badges for the given user */
export const useBadges = (userId: string): UseBadgesResult => {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('badges')
      .select('*')
      .eq('user_id', userId);
    setBadges((data as Badge[]) ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { badges, loading, refetch: fetch };
};
