import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useProfile } from '../../context/ProfileContext';

export const ProfileGuard = () => {
  const { profile, profileLoading } = useProfile();
  const { t } = useTranslation();

  if (profileLoading) {
    return (
      <div
        style={{
          minHeight: '100dvh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          color: '#6b7280',
        }}
      >
        {t('common.loading')}
      </div>
    );
  }

  if (!profile) return <Navigate to="/onboarding" replace />;

  return <Outlet />;
};
