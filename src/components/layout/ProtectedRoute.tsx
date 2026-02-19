import { Navigate, Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = () => {
  const { session, loading } = useAuth();
  const { t } = useTranslation();

  if (loading) {
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

  if (!session) return <Navigate to="/login" replace />;

  return <Outlet />;
};
