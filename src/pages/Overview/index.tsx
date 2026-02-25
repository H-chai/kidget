import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PieChart, Pie } from "recharts";
import { MdSettings } from "react-icons/md";
import { Mascot } from "../../components/ui/Mascot";
import { MascotFace } from "../../components/ui/MascotFace";
import trioRight from "../../assets/mascots/trio/trio-right.svg";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { useTransactions } from "../../hooks/useTransactions";
import { useGoals } from "../../hooks/useGoals";
import {
  calculateBalance,
  calculateLevel,
  choresToNextLevel,
  levelProgressPercent,
} from "../../utils";
import { Card } from "../../components/ui/Card";
import { ProgressBar } from "../../components/ui/ProgressBar";
import "./Overview.css";

const GOAL_CARD_COLORS = [
  { bg: "#FFC9A2", fill: "#F18334", track: "rgba(255, 255, 255, 0.2)" },
  { bg: "#D6FFBB", fill: "#6EE057", track: "rgba(255, 255, 255, 0.2)" },
];

export const OverviewPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isWide, setIsWide] = useState(
    () => window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = (e: MediaQueryListEvent) => setIsWide(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const chartSize = isWide ? 72 : 56;
  const chartCenter = chartSize / 2;
  const { profile } = useProfile();
  const { transactions, loading: txLoading } = useTransactions(user!.id);
  const { goals, loading: goalsLoading } = useGoals(user!.id);

  if (txLoading || goalsLoading) {
    return (
      <div className="overview-page">
        <p className="overview-loading">{t("common.loading")}</p>
      </div>
    );
  }

  const balance = calculateBalance(transactions);
  const choreCount = transactions.filter((tx) => tx.type === "income").length;
  const level = calculateLevel(choreCount);
  const choresToNext = choresToNextLevel(choreCount);
  const levelPercent = levelProgressPercent(choreCount);

  const activeGoals = goals.filter((g) => g.achieved_at === null);
  const displayGoals = activeGoals.slice(0, 2);
  const hasMoreGoals = activeGoals.length > 2;

  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="overview-page">
      {/* Yellow hero: settings + greeting */}
      <div className="overview-hero">
        <Link
          to="/settings"
          className="overview-settings-btn"
          aria-label={t("settings.title")}
        >
          <MdSettings size={24} />
        </Link>
        <div className="overview-greeting">
          <MascotFace
            color={profile?.avatar_emoji ?? "#3C87D5"}
            width={32}
            height="auto"
            className="overview-greeting-mascot"
          />
          <h1 className="overview-greeting-text">
            {t("overview.greeting", { name: profile?.name })}
          </h1>
        </div>
      </div>

      {/* Balance — overlaps the hero bottom */}
      <Card className="balance-card">
        <p className="balance-label">{t("overview.balance")}</p>
        <p className="balance-amount">
          <span className="balance-symbol">{t("common.currencySymbol")}</span>
          {balance}
        </p>
        <Mascot
          color={profile?.avatar_emoji ?? "#3C87D5"}
          height={120}
          className="balance-mascot"
        />
      </Card>

      {/* Active savings goals */}
      <div>
        <p className="section-label">{t("overview.activeGoal")}</p>
        {activeGoals.length === 0 ? (
          <Card>
            <p className="no-goals">{t("overview.noGoals")}</p>
          </Card>
        ) : (
          <>
            <div className="goals-grid">
              {displayGoals.map((goal, i) => {
                const progress = Math.max(
                  0,
                  Math.min(100, (balance / goal.target_amount) * 100),
                );
                const remaining = Math.max(0, goal.target_amount - balance);
                const colors = GOAL_CARD_COLORS[i % GOAL_CARD_COLORS.length];
                const donutData = [
                  { value: Math.max(0, progress), fill: colors.fill },
                  { value: Math.max(0, 100 - progress), fill: colors.track },
                ];
                return (
                  <div
                    key={goal.id}
                    className="goal-mini-card"
                    style={{ background: colors.bg }}
                  >
                    <div className="goal-mini-top">
                      <div className="goal-mini-left">
                        <p className="goal-mini-title">{goal.title}</p>
                        <p className="goal-mini-amount">
                          <span className="goal-mini-symbol">
                            {t("common.currencySymbol")}
                          </span>
                          {goal.target_amount}
                        </p>
                      </div>
                      <div className="goal-mini-chart-wrap">
                        <PieChart
                          width={chartSize}
                          height={chartSize}
                          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                        >
                          <Pie
                            data={donutData}
                            cx={chartCenter}
                            cy={chartCenter}
                            innerRadius={Math.round((16 / 56) * chartSize)}
                            outerRadius={Math.round((26 / 56) * chartSize)}
                            startAngle={90}
                            endAngle={-270}
                            dataKey="value"
                            stroke="#111"
                            strokeWidth={1}
                          />
                        </PieChart>
                      </div>
                    </div>
                    <p className="goal-mini-more">
                      {remaining === 0
                        ? t("overview.goalReached")
                        : `${t("common.currency", { amount: remaining })} ${t("overview.moreToGoLabel")}`}
                    </p>
                  </div>
                );
              })}
            </div>
            {hasMoreGoals && (
              <Link to="/goals" className="goals-see-all">
                {t("overview.seeAllGoals")}
              </Link>
            )}
          </>
        )}
      </div>

      {/* Level progress */}
      <Card className="level-card">
        <img src={trioRight} alt="" className="level-mascot" />
        <div className="level-header">
          <div className="level-badge">Lv {level}</div>
          <div>
            <p className="level-title">{t("badges.level", { level })}</p>
            <p className="level-subtitle">
              {choresToNext !== null
                ? t("overview.choresToLevelUp", { count: choresToNext })
                : t("overview.maxLevel")}
            </p>
          </div>
        </div>
        {choresToNext !== null && <ProgressBar value={levelPercent} />}
      </Card>

      {/* Recent transactions */}
      <div>
        <p className="section-label">{t("overview.recentTransactions")}</p>
        <Card>
          {recentTransactions.length === 0 ? (
            <p className="no-transactions">{t("overview.noTransactions")}</p>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="transaction-item">
                  <div
                    className={`transaction-icon transaction-icon--${tx.type}`}
                  >
                    {tx.type === "income" ? "⭐" : "💸"}
                  </div>
                  <div className="transaction-desc">
                    <p className="transaction-description">{tx.description}</p>
                    <p className="transaction-date">{tx.date}</p>
                  </div>
                  <span
                    className={`transaction-amount transaction-amount--${tx.type}`}
                  >
                    {tx.type === "income" ? "+" : "−"}
                    {t("common.currency", { amount: tx.amount })}
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
