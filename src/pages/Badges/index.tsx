import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { useTransactions } from '../../hooks/useTransactions';
import { useGoals } from '../../hooks/useGoals';
import { useBadges } from '../../hooks/useBadges';
import { checkEarnedBadgeIds } from '../../utils/badges';
import { calculateLevel, choresToNextLevel, levelProgressPercent } from '../../utils/level';
import { BADGE_DEFINITIONS } from '../../constants';
import { ProgressBar } from '../../components/ui/ProgressBar';
import './Badges.css';

const LEVEL_EMOJI: Record<number, string> = {
  1: '🌱',
  2: '⭐',
  3: '🏅',
  4: '🥇',
  5: '🏆',
};

export const BadgesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { transactions, loading: txLoading } = useTransactions(user!.id);
  const { goals, loading: goalsLoading } = useGoals(user!.id);
  const { badges, loading: badgesLoading, refetch: refetchBadges } = useBadges(user!.id);

  const choreCount = transactions.filter(tx => tx.type === 'income').length;
  const level = calculateLevel(choreCount);
  const toNext = choresToNextLevel(choreCount);
  const progressPct = levelProgressPercent(choreCount);

  // Award any newly earned badges
  useEffect(() => {
    if (txLoading || goalsLoading || badgesLoading) return;

    const earnedIds = checkEarnedBadgeIds(transactions, goals);
    const savedIds = new Set(badges.map(b => b.badge_id));
    const newIds = earnedIds.filter(id => !savedIds.has(id));

    if (newIds.length === 0) return;

    const rows = newIds.map(badge_id => ({ user_id: user!.id, badge_id }));
    supabase.from('badges').insert(rows).then(() => refetchBadges());
  }, [transactions, goals, badges, txLoading, goalsLoading, badgesLoading, user, refetchBadges]);

  const earnedIds = new Set(badges.map(b => b.badge_id));
  const earnedBadges = BADGE_DEFINITIONS.filter(b => earnedIds.has(b.id));
  const unearnedBadges = BADGE_DEFINITIONS.filter(b => !earnedIds.has(b.id));

  return (
    <div className="badges-page">

      <h1 className="badges-page-title">{t('badges.title')}</h1>

      {/* Level card */}
      <div className="level-card">
        <div className="level-top-row">
          <span className="level-icon">{LEVEL_EMOJI[level]}</span>
          <span className="level-label">{t('badges.level', { level })}</span>
        </div>
        <ProgressBar value={progressPct} color="rgba(255, 255, 255, 0.9)" />
        <span className="level-footer">
          {toNext !== null
            ? t('badges.choresToNextLevel', { count: toNext })
            : t('badges.maxLevel')}
        </span>
      </div>

      {/* Earned badges */}
      {earnedBadges.length > 0 && (
        <div className="badges-section">
          <p className="badges-section-title">{t('badges.earnedSection')}</p>
          <div className="badge-grid">
            {earnedBadges.map(badge => (
              <div key={badge.id} className="badge-card">
                <span className="badge-emoji">{badge.emoji}</span>
                <span className="badge-name">{t(badge.nameKey)}</span>
                <span className="badge-desc">{t(badge.descriptionKey)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Unearned badges */}
      {unearnedBadges.length > 0 && (
        <div className="badges-section">
          <p className="badges-section-title">{t('badges.unearnedSection')}</p>
          <div className="badge-grid">
            {unearnedBadges.map(badge => (
              <div key={badge.id} className="badge-card badge-card--unearned">
                <span className="badge-emoji">{badge.emoji}</span>
                <span className="badge-name">{t(badge.nameKey)}</span>
                <span className="badge-desc">{t(badge.descriptionKey)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
