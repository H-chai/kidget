import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useTransactions } from '../../hooks/useTransactions';
import { useGoals } from '../../hooks/useGoals';
import { calculateBalance, calculateLevel, choresToNextLevel, levelProgressPercent } from '../../utils';
import { Card } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import './Overview.css';

export const OverviewPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { transactions, loading: txLoading } = useTransactions(user!.id);
  const { goals, loading: goalsLoading } = useGoals(user!.id);

  if (txLoading || goalsLoading) {
    return (
      <div className="overview-page">
        <p className="overview-loading">{t('common.loading')}</p>
      </div>
    );
  }

  const balance = calculateBalance(transactions);
  const choreCount = transactions.filter(tx => tx.type === 'income').length;
  const level = calculateLevel(choreCount);
  const choresToNext = choresToNextLevel(choreCount);
  const levelPercent = levelProgressPercent(choreCount);

  // First non-achieved goal is the "active" goal
  const activeGoal = goals.find(g => g.achieved_at === null) ?? null;
  const goalProgress = activeGoal
    ? Math.max(0, Math.min(100, (balance / activeGoal.target_amount) * 100))
    : 0;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="overview-page">

      {/* Balance */}
      <Card className="balance-card">
        <p className="balance-label">{t('overview.balance')}</p>
        <p className="balance-amount">{balance}</p>
      </Card>

      {/* Active savings goal */}
      {activeGoal && (
        <Card>
          <p className="section-label">{t('overview.activeGoal')}</p>
          <p className="goal-title">{activeGoal.title}</p>
          <ProgressBar value={goalProgress} color="#10b981" />
          <div className="goal-amounts">
            <span>{balance}</span>
            <span>{activeGoal.target_amount}</span>
          </div>
        </Card>
      )}

      {/* Level progress */}
      <Card>
        <div className="level-header">
          <div className="level-badge">Lv {level}</div>
          <div>
            <p className="level-title">{t('badges.level', { level })}</p>
            <p className="level-subtitle">
              {choresToNext !== null
                ? t('overview.choresToLevelUp', { count: choresToNext })
                : t('overview.maxLevel')}
            </p>
          </div>
        </div>
        {choresToNext !== null && <ProgressBar value={levelPercent} />}
      </Card>

      {/* Recent transactions */}
      <div>
        <p className="section-label">{t('overview.recentTransactions')}</p>
        <Card>
          {recentTransactions.length === 0 ? (
            <p className="no-transactions">{t('overview.noTransactions')}</p>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map(tx => (
                <div key={tx.id} className="transaction-item">
                  <div className={`transaction-icon transaction-icon--${tx.type}`}>
                    {tx.type === 'income' ? '⭐' : '💸'}
                  </div>
                  <div className="transaction-desc">
                    <p className="transaction-description">{tx.description}</p>
                    <p className="transaction-date">{tx.date}</p>
                  </div>
                  <span className={`transaction-amount transaction-amount--${tx.type}`}>
                    {tx.type === 'income' ? '+' : '−'}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

    </div>
  );
};
