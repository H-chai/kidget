import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Profile } from '../types';

const STORAGE_COLOR_KEY = 'kidget:userColor';

type ProfileContextValue = {
  profile: Profile | null;
  profileLoading: boolean;
  refetchProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    const profile = (data as Profile) ?? null;
    if (profile) localStorage.setItem(STORAGE_COLOR_KEY, profile.avatar_emoji);
    setProfile(profile);
    setProfileLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <ProfileContext.Provider value={{ profile, profileLoading, refetchProfile: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

/** Returns the current user's profile. Must be used inside ProfileProvider. */
export const useProfile = (): ProfileContextValue => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
};
