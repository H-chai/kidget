import { useTranslation } from 'react-i18next';
import { OverviewPage } from './pages/Overview';

export const App = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>Kidget</h1>
      <p>{t('common.loading')}</p>
      <OverviewPage />
    </div>
  );
};
