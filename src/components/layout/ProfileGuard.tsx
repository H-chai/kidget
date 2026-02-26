import { Navigate, Outlet } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { LoadingScreen } from './LoadingScreen';

export const ProfileGuard = () => {
  const { profile, profileLoading } = useProfile();

  if (profileLoading) return <LoadingScreen />;
  if (!profile) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
};
