import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../hooks/useTransactions';
import { Card } from '../../components/ui/Card';
import './History.css';

/** Formats "2026-01" → "Jan 2026" */
const formatMonth = (ym: string): string => {
  const [year, month] = ym.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
};

export const HistoryPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { transactions, loading } = useTransactions(user!.id);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  const availableMonths = useMemo(
    () =>
      [...new Set(transactions.map(tx => tx.date.slice(0, 7)))].sort((a, b) =>
        b.localeCompare(a)
      ),
    [transactions]
  );

  const filtered = useMemo(
    () =>
      selectedMonth
        ? transactions.filter(tx => tx.date.startsWith(selectedMonth))
        : transactions,
    [transactions, selectedMonth]
  );

  const totalIncome = useMemo(
    () => filtered.filter(tx => tx.type === 'income').reduce((s, tx) => s + tx.amount, 0),
    [filtered]
  );

  const totalExpense = useMemo(
    () => filtered.filter(tx => tx.type === 'expense').reduce((s, tx) => s + tx.amount, 0),
    [filtered]
  );

  if (loading) {
    return (
      <div className="history-page">
        <p className="history-loading">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="history-page">
      <h1 className="history-title">{t('history.title')}</h1>

      {/* Month filter */}
      {availableMonths.length > 0 && (
        <div className="month-filter">
          <button
            className={`month-chip${selectedMonth === null ? ' month-chip--active' : ''}`}
            onClick={() => setSelectedMonth(null)}
          >
            {t('history.all')}
          </button>
          {availableMonths.map(m => (
            <button
              key={m}
              className={`month-chip${selectedMonth === m ? ' month-chip--active' : ''}`}
              onClick={() => setSelectedMonth(m)}
            >
              {formatMonth(m)}
            </button>
          ))}
        </div>
      )}

      {/* Period summary */}
      {filtered.length > 0 && (
        <div className="history-summary">
          <div className="summary-item">
            <p className="summary-label">{t('history.income')}</p>
            <p className="summary-amount summary-amount--income">+{totalIncome}</p>
          </div>
          <div className="summary-item">
            <p className="summary-label">{t('history.expense')}</p>
            <p className="summary-amount summary-amount--expense">−{totalExpense}</p>
          </div>
        </div>
      )}

      {/* Transaction list */}
      {filtered.length === 0 ? (
        <Card>
          <p className="history-empty">{t('history.noTransactions')}</p>
        </Card>
      ) : (
        <Card>
          <div className="history-list">
            {filtered.map(tx => (
              <div key={tx.id} className="history-item">
                <div className={`history-icon history-icon--${tx.type}`}>
                  {tx.type === 'income' ? '⭐' : '💸'}
                </div>
                <div className="history-desc">
                  <p className="history-description">{tx.description}</p>
                  <p className="history-date">{tx.date}</p>
                </div>
                <span className={`history-amount history-amount--${tx.type}`}>
                  {tx.type === 'income' ? '+' : '−'}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
