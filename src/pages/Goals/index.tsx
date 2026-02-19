import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useGoals } from '../../hooks/useGoals';
import { useTransactions } from '../../hooks/useTransactions';
import { calculateBalance } from '../../utils/balance';
import { ProgressBar } from '../../components/ui/ProgressBar';
import type { Goal } from '../../types';
import './Goals.css';

export const GoalsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { goals, loading, refetch } = useGoals(user!.id);
  const { transactions } = useTransactions(user!.id);
  const balance = calculateBalance(transactions);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const openForm = () => { setShowForm(true); setFormError(null); };
  const closeForm = () => { setShowForm(false); setTitle(''); setTargetAmount(''); setFormError(null); };

  const handleAddGoal = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const amount = parseInt(targetAmount, 10);
    if (!amount || amount <= 0) return;

    setSubmitting(true);
    const { error } = await supabase.from('goals').insert({
      user_id: user!.id,
      title: title.trim(),
      target_amount: amount,
    });

    if (error) {
      setFormError(error.message);
      setSubmitting(false);
    } else {
      closeForm();
      refetch();
      setSubmitting(false);
    }
  };

  const handleMarkAchieved = async (goal: Goal) => {
    await supabase
      .from('goals')
      .update({ achieved_at: new Date().toISOString() })
      .eq('id', goal.id);
    refetch();
  };

  const handleDelete = async (goal: Goal) => {
    await supabase.from('goals').delete().eq('id', goal.id);
    refetch();
  };

  return (
    <div className="goals-page">

      {/* Header */}
      <div className="goals-header">
        <h1 className="goals-title">{t('goals.title')}</h1>
        <button
          type="button"
          className={`goals-add-btn${showForm ? ' goals-add-btn--cancel' : ''}`}
          onClick={showForm ? closeForm : openForm}
        >
          {showForm ? t('goals.cancel') : t('goals.addGoal')}
        </button>
      </div>

      {/* Add goal form */}
      {showForm && (
        <form className="goals-form" onSubmit={handleAddGoal}>
          <div className="goals-field">
            <label className="goals-label" htmlFor="goal-title">
              {t('goals.goalName')}
            </label>
            <input
              id="goal-title"
              className="goals-input"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder={t('goals.goalNamePlaceholder')}
              required
              autoFocus
            />
          </div>

          <div className="goals-field">
            <label className="goals-label" htmlFor="goal-amount">
              {t('goals.targetAmount')}
            </label>
            <input
              id="goal-amount"
              className="goals-input"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              placeholder="0"
              required
            />
          </div>

          {formError && <p className="goals-form-error">{formError}</p>}

          <div className="goals-form-actions">
            <button type="button" className="goals-form-cancel" onClick={closeForm}>
              {t('goals.cancel')}
            </button>
            <button type="submit" className="goals-form-save" disabled={submitting}>
              {submitting ? t('common.loading') : t('goals.save')}
            </button>
          </div>
        </form>
      )}

      {/* Goal list */}
      {!loading && goals.length === 0 && (
        <p className="goals-empty">{t('goals.noGoals')}</p>
      )}

      <ul className="goals-list">
        {goals.map(goal => {
          const isAchieved = !!goal.achieved_at;
          const percent = Math.min(100, Math.max(0, (balance / goal.target_amount) * 100));

          return (
            <li key={goal.id} className={`goal-card${isAchieved ? ' goal-card--achieved' : ''}`}>
              <div className="goal-card-header">
                <span className="goal-name">
                  {isAchieved ? '✅ ' : ''}{goal.title}
                </span>
                <button
                  type="button"
                  className="goal-delete-btn"
                  onClick={() => handleDelete(goal)}
                  aria-label={t('goals.delete')}
                >
                  ✕
                </button>
              </div>

              <ProgressBar value={percent} color={isAchieved ? '#10b981' : '#6366f1'} />

              <div className="goal-progress-label">
                {t('goals.progress', {
                  current: balance.toLocaleString(),
                  target: goal.target_amount.toLocaleString(),
                })}
                {isAchieved && (
                  <span className="goal-achieved-badge">{t('goals.achieved')}</span>
                )}
              </div>

              {!isAchieved && percent >= 100 && (
                <button
                  type="button"
                  className="goal-achieve-btn"
                  onClick={() => handleMarkAchieved(goal)}
                >
                  {t('goals.markAchieved')}
                </button>
              )}
            </li>
          );
        })}
      </ul>

    </div>
  );
};
