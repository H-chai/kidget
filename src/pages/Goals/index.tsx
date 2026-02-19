import { useTranslation } from 'react-i18next';

export const GoalsPage = () => {
  const { t } = useTranslation();
  return <div>{t('goals.title')}</div>;
};
