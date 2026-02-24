import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PieChart, Pie } from "recharts";
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
  { bg: "#FFC9A2", fill: "#F18334", track: "#E9E4E4" },
  { bg: "#D6FFBB", fill: "#6EE057", track: "#E9E4E4" },
];

export const OverviewPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
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
      {/* Greeting header */}
      <div className="overview-header">
        <div className="overview-greeting">
          <span className="overview-avatar">{profile?.avatar_emoji}</span>
          <p className="overview-greeting-text">
            {t("overview.greeting", { name: profile?.name })}
          </p>
        </div>
        <Link
          to="/settings"
          className="overview-settings-btn"
          aria-label={t("settings.title")}
        >
          ⚙️
        </Link>
      </div>

      {/* Balance */}
      <Card className="balance-card">
        <p className="balance-label">{t("overview.balance")}</p>
        <p className="balance-amount">{balance}</p>
      </Card>

      {/* Active savings goals */}
      {displayGoals.length > 0 && (
        <div>
          <p className="section-label">{t("overview.activeGoal")}</p>
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
                  <div className="goal-mini-left">
                    <p className="goal-mini-title">{goal.title}</p>
                    <p className="goal-mini-amount">{remaining}</p>
                    <p className="goal-mini-more">
                      {t("overview.moreToGoLabel")}
                    </p>
                  </div>
                  <div className="goal-mini-chart-wrap">
                    <PieChart
                      width={72}
                      height={72}
                      margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                    >
                      <Pie
                        data={donutData}
                        cx={36}
                        cy={36}
                        innerRadius={24}
                        outerRadius={34}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        strokeWidth={0}
                      />
                    </PieChart>
                  </div>
                </div>
              );
            })}
          </div>
          {hasMoreGoals && (
            <Link to="/goals" className="goals-see-all">
              {t("overview.seeAllGoals")}
            </Link>
          )}
        </div>
      )}

      {/* Level progress */}
      <Card>
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
                    {tx.amount}
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
