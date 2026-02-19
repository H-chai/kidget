import { useTranslation } from 'react-i18next';

export const AddTransactionPage = () => {
  const { t } = useTranslation();
  return <div>{t('addTransaction.title')}</div>;
};
