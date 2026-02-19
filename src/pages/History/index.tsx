import { useTranslation } from 'react-i18next';

export const HistoryPage = () => {
  const { t } = useTranslation();
  return <div>{t('history.title')}</div>;
};
