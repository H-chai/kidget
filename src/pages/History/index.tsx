import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useTransactions } from '../../hooks/useTransactions';
import { Card } from '../../components/ui/Card';
import type { Transaction, TransactionType } from '../../types';
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
  const { transactions, loading, refetch } = useTransactions(user!.id);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  // Edit / delete state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editType, setEditType] = useState<TransactionType>('income');
  const [editAmount, setEditAmount] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [saving, setSaving] = useState(false);

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

  const startEdit = (tx: Transaction) => {
    setConfirmDeleteId(null);
    setEditingId(tx.id);
    setEditType(tx.type);
    setEditAmount(String(tx.amount));
    setEditDescription(tx.description);
    setEditDate(tx.date);
  };

  const cancelEdit = () => setEditingId(null);

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const amountInt = parseInt(editAmount, 10);
    if (!amountInt || amountInt <= 0) return;

    setSaving(true);
    await supabase
      .from('transactions')
      .update({
        type: editType,
        amount: amountInt,
        description: editDescription.trim(),
        date: editDate,
      })
      .eq('id', editingId!);
    setSaving(false);
    setEditingId(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from('transactions').delete().eq('id', id);
    refetch();
  };

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
              <div
                key={tx.id}
                className={`history-item${editingId === tx.id ? ' history-item--editing' : ''}`}
              >
                {editingId === tx.id ? (
                  <form className="history-edit-form" onSubmit={handleSave}>

                    {/* Type toggle */}
                    <div className="edit-type-row">
                      <button
                        type="button"
                        className={`edit-type-btn${editType === 'income' ? ' edit-type-btn--income' : ''}`}
                        onClick={() => setEditType('income')}
                      >
                        ⭐ {t('addTransaction.income')}
                      </button>
                      <button
                        type="button"
                        className={`edit-type-btn${editType === 'expense' ? ' edit-type-btn--expense' : ''}`}
                        onClick={() => setEditType('expense')}
                      >
                        💸 {t('addTransaction.expense')}
                      </button>
                    </div>

                    {/* Description */}
                    <input
                      className="edit-input"
                      type="text"
                      value={editDescription}
                      onChange={e => setEditDescription(e.target.value)}
                      placeholder={t('addTransaction.description')}
                      required
                      autoFocus
                    />

                    {/* Amount + Date */}
                    <div className="edit-amount-date-row">
                      <input
                        className="edit-input edit-input--amount"
                        type="number"
                        inputMode="numeric"
                        min="1"
                        step="1"
                        value={editAmount}
                        onChange={e => setEditAmount(e.target.value)}
                        required
                      />
                      <input
                        className="edit-input edit-input--date"
                        type="date"
                        value={editDate}
                        onChange={e => setEditDate(e.target.value)}
                        required
                      />
                    </div>

                    {/* Actions */}
                    <div className="edit-actions">
                      <button type="button" className="edit-cancel-btn" onClick={cancelEdit}>
                        {t('common.cancel')}
                      </button>
                      <button type="submit" className="edit-save-btn" disabled={saving}>
                        {saving ? t('common.loading') : t('common.save')}
                      </button>
                    </div>

                  </form>
                ) : (
                  <>
                    <div className={`history-icon history-icon--${tx.type}`}>
                      {tx.type === 'income' ? '⭐' : '💸'}
                    </div>
                    <div className="history-desc">
                      <p className="history-description">{tx.description}</p>
                      <p className="history-date">{tx.date}</p>
                    </div>

                    {confirmDeleteId === tx.id ? (
                      <div className="delete-confirm-inline">
                        <span className="delete-confirm-question">
                          {t('history.deleteConfirm')}
                        </span>
                        <button
                          type="button"
                          className="delete-keep-btn"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          {t('common.cancel')}
                        </button>
                        <button
                          type="button"
                          className="delete-yes-btn"
                          onClick={() => handleDelete(tx.id)}
                        >
                          {t('common.delete')}
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className={`history-amount history-amount--${tx.type}`}>
                          {tx.type === 'income' ? '+' : '−'}{tx.amount}
                        </span>
                        <button
                          type="button"
                          className="history-action-btn history-action-btn--edit"
                          onClick={() => startEdit(tx)}
                          aria-label={t('common.edit')}
                        >
                          ✎
                        </button>
                        <button
                          type="button"
                          className="history-action-btn history-action-btn--delete"
                          onClick={() => setConfirmDeleteId(tx.id)}
                          aria-label={t('common.delete')}
                        >
                          ✕
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
