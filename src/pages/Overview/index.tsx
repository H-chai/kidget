import { useTranslation } from 'react-i18next';

export const OverviewPage = () => {
  const { t } = useTranslation();
  return <div>{t('nav.overview')}</div>;
};
