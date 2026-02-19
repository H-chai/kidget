import { useTranslation } from 'react-i18next';

export const BadgesPage = () => {
  const { t } = useTranslation();
  return <div>{t('badges.title')}</div>;
};
