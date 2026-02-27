import { useEffect, useRef, useState, type ComponentType } from "react";
import { useTranslation } from "react-i18next";
import {
  TbHexagonNumber1Filled,
  TbHexagonNumber2Filled,
  TbHexagonNumber3Filled,
  TbHexagonNumber4Filled,
  TbHexagonNumber5Filled,
  TbHexagonNumber6Filled,
  TbHexagonNumber7Filled,
  TbHexagonNumber8Filled,
  TbHexagonNumber9Filled,
  TbMedal2,
} from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { MascotFace } from "../../components/ui/MascotFace";
import { supabase } from "../../lib/supabase";
import { useTransactions } from "../../hooks/useTransactions";
import { useGoals } from "../../hooks/useGoals";
import { useBadges } from "../../hooks/useBadges";
import { checkEarnedBadgeIds } from "../../utils/badges";
import {
  calculateLevel,
  choresToNextLevel,
  levelProgressPercent,
} from "../../utils/level";
import { BADGE_DEFINITIONS } from "../../constants";
import type { BadgeDefinition } from "../../types";
import { ProgressBar } from "../../components/ui/ProgressBar";
import "./Badges.css";

const BadgeEmoji = ({
  badge,
  animating,
}: {
  badge: BadgeDefinition;
  animating?: boolean;
}) => {
  const Icon = badge.emoji;
  const count = badge.count ?? 1;
  return (
    <span
      className={`badge-emoji${animating ? " badge-emoji--animating" : ""}`}
      style={{ color: badge.color, display: "flex", gap: 2 }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Icon key={i} size={24} />
      ))}
    </span>
  );
};

const LEVEL_ICONS: Record<number, ComponentType<{ size?: number }>> = {
  1:  TbHexagonNumber1Filled,
  2:  TbHexagonNumber2Filled,
  3:  TbHexagonNumber3Filled,
  4:  TbHexagonNumber4Filled,
  5:  TbHexagonNumber5Filled,
  6:  TbHexagonNumber6Filled,
  7:  TbHexagonNumber7Filled,
  8:  TbHexagonNumber8Filled,
  9:  TbHexagonNumber9Filled,
  10: TbMedal2,
};

export const BadgesPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { profile } = useProfile();

  const { transactions, loading: txLoading } = useTransactions(user!.id);
  const { goals, loading: goalsLoading } = useGoals(user!.id);
  const {
    badges,
    loading: badgesLoading,
    refetch: refetchBadges,
  } = useBadges(user!.id);

  const choreCount = transactions.filter((tx) => tx.type === "income").length;
  const level = calculateLevel(choreCount);
  const toNext = choresToNextLevel(choreCount);
  const progressPct = levelProgressPercent(choreCount);
  const LevelIcon = LEVEL_ICONS[level];

  // Award any newly earned badges
  useEffect(() => {
    if (txLoading || goalsLoading || badgesLoading) return;

    const earnedIds = checkEarnedBadgeIds(transactions, goals);
    const savedIds = new Set(badges.map((b) => b.badge_id));
    const newIds = earnedIds.filter((id) => !savedIds.has(id));

    if (newIds.length === 0) return;

    const rows = newIds.map((badge_id) => ({ user_id: user!.id, badge_id }));
    supabase
      .from("badges")
      .insert(rows)
      .then(() => refetchBadges());
  }, [
    transactions,
    goals,
    badges,
    txLoading,
    goalsLoading,
    badgesLoading,
    user,
    refetchBadges,
  ]);

  const earnedIds = new Set(badges.map((b) => b.badge_id));
  const earnedBadges = BADGE_DEFINITIONS.filter((b) => earnedIds.has(b.id));
  const unearnedBadges = BADGE_DEFINITIONS.filter((b) => !earnedIds.has(b.id));

  // Randomly animate a badge from the earned list
  const [animatingId, setAnimatingId] = useState<string | null>(null);
  const earnedBadgesRef = useRef(earnedBadges);
  useEffect(() => { earnedBadgesRef.current = earnedBadges; });
  useEffect(() => {
    if (earnedBadges.length === 0) return;
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        await new Promise<void>((r) =>
          setTimeout(r, 1500 + Math.random() * 2500)
        );
        if (cancelled) break;
        const list = earnedBadgesRef.current;
        const badge = list[Math.floor(Math.random() * list.length)];
        setAnimatingId(badge.id);
        await new Promise<void>((r) => setTimeout(r, 750));
        if (cancelled) break;
        setAnimatingId(null);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [earnedBadges.length]);

  return (
    <div className="badges-page">
      {/* SVG gradient definition for level icon */}
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="level-grad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F18334" />
            <stop offset="100%" stopColor="#FADA66" />
          </linearGradient>
        </defs>
      </svg>
      <div className="badges-page-inner">
        <div className="page-heading">
          <MascotFace
            color={profile?.avatar_emoji ?? "#3C87D5"}
            width={32}
            height="auto"
            className="page-heading-mascot"
          />
          <h1 className="badges-page-title">{t("badges.title")}</h1>
        </div>

        {/* Level card */}
        <div className="level-card">
          <div className="level-top-row">
            <span className="level-icon"><LevelIcon size={38} /></span>
            <span className="level-label">{t("badges.level", { level })}</span>
          </div>
          <ProgressBar value={progressPct} color="var(--color-accent)" />
          <span className="level-footer">
            {toNext !== null
              ? t("badges.choresToNextLevel", { count: toNext })
              : t("badges.maxLevel")}
          </span>
        </div>

        {/* Earned badges */}
        {earnedBadges.length > 0 && (
          <div className="badges-section">
            <p className="badges-section-title">{t("badges.earnedSection")}</p>
            <div className="badge-grid">
              {earnedBadges.map((badge) => (
                <div key={badge.id} className="badge-card">
                  <BadgeEmoji badge={badge} animating={badge.id === animatingId} />
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
            <p className="badges-section-title">
              {t("badges.unearnedSection")}
            </p>
            <div className="badge-grid">
              {unearnedBadges.map((badge) => (
                <div key={badge.id} className="badge-card badge-card--unearned">
                  <BadgeEmoji badge={badge} />
                  <span className="badge-name">{t(badge.nameKey)}</span>
                  <span className="badge-desc">{t(badge.descriptionKey)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
