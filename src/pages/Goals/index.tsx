import { useState } from "react";
import { useTranslation } from "react-i18next";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import facePlainBlue from "../../assets/mascots/face/face-plain-blue.svg";
import facePlainGreen from "../../assets/mascots/face/face-plain-green.svg";
import facePlainOrange from "../../assets/mascots/face/face-plain-orange.svg";
import facePlainPink from "../../assets/mascots/face/face-plain-pink.svg";
import facePlainPurple from "../../assets/mascots/face/face-plain-purple.svg";
import { MascotFace } from "../../components/ui/MascotFace";
import { supabase } from "../../lib/supabase";
import { useGoals } from "../../hooks/useGoals";
import { useTransactions } from "../../hooks/useTransactions";
import { calculateBalance } from "../../utils/balance";
import { ProgressBar } from "../../components/ui/ProgressBar";
import { LoadingScreen } from "../../components/layout/LoadingScreen";
import type { Goal } from "../../types";
import "./Goals.css";

const BG_FACES = [
  {
    src: facePlainBlue,
    top: "4%",
    left: "36%",
    size: 52,
    rotate: -18,
    opacity: 0.28,
  },
  {
    src: facePlainPink,
    top: "2%",
    left: "72%",
    size: 38,
    rotate: 12,
    opacity: 0.25,
  },
  {
    src: facePlainGreen,
    top: "18%",
    left: "88%",
    size: 96,
    rotate: -8,
    opacity: 0.24,
  },
  {
    src: facePlainOrange,
    top: "34%",
    left: "0%",
    size: 120,
    rotate: 20,
    opacity: 0.26,
  },
  {
    src: facePlainPurple,
    top: "50%",
    left: "82%",
    size: 56,
    rotate: -22,
    opacity: 0.23,
  },
  {
    src: facePlainBlue,
    top: "62%",
    left: "10%",
    size: 36,
    rotate: 15,
    opacity: 0.22,
  },
  {
    src: facePlainPink,
    top: "74%",
    left: "60%",
    size: 100,
    rotate: -10,
    opacity: 0.25,
  },
  {
    src: facePlainGreen,
    top: "84%",
    left: "30%",
    size: 82,
    rotate: 25,
    opacity: 0.23,
  },
  {
    src: facePlainOrange,
    top: "88%",
    left: "78%",
    size: 54,
    rotate: -30,
    opacity: 0.24,
  },
  {
    src: facePlainPurple,
    top: "44%",
    left: "46%",
    size: 30,
    rotate: 18,
    opacity: 0.2,
  },
];

export const GoalsPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { goals, loading, refetch } = useGoals(user!.id);
  const { transactions } = useTransactions(user!.id);
  const balance = calculateBalance(transactions);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (loading) return <LoadingScreen />;

  const openForm = () => {
    setShowForm(true);
    setFormError(null);
  };
  const closeForm = () => {
    setShowForm(false);
    setTitle("");
    setTargetAmount("");
    setFormError(null);
  };

  const handleAddGoal = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const amount = parseInt(targetAmount, 10);
    if (!amount || amount <= 0) return;

    setSubmitting(true);
    const { error } = await supabase.from("goals").insert({
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
      .from("goals")
      .update({ achieved_at: new Date().toISOString() })
      .eq("id", goal.id);
    refetch();
  };

  const handleDelete = async (goal: Goal) => {
    await supabase.from("goals").delete().eq("id", goal.id);
    refetch();
  };

  return (
    <div className="goals-page">
      <div className="goals-bg-mascots" aria-hidden="true">
        {BG_FACES.map((f, i) => (
          <img
            key={i}
            src={f.src}
            alt=""
            style={{
              position: "absolute",
              top: f.top,
              left: f.left,
              width: f.size,
              height: f.size,
              opacity: f.opacity,
              transform: `rotate(${f.rotate}deg)`,
              userSelect: "none",
            }}
          />
        ))}
      </div>
      <div className="goals-page-inner">
        {/* Header */}
        <div className="goals-header">
          <div className="page-heading">
            <MascotFace
              color={profile?.avatar_emoji ?? "#3C87D5"}
              width={32}
              height="auto"
              className="page-heading-mascot"
            />
            <h1 className="goals-title">{t("goals.title")}</h1>
          </div>
          <button
            type="button"
            className={`goals-add-btn${showForm ? " goals-add-btn--cancel" : ""}`}
            onClick={showForm ? closeForm : openForm}
          >
            {showForm ? t("goals.cancel") : t("goals.addGoal")}
          </button>
        </div>

        {/* Add goal form */}
        {showForm && (
          <form className="goals-form" onSubmit={handleAddGoal}>
            <div className="goals-field">
              <label className="goals-label" htmlFor="goal-title">
                {t("goals.goalName")}
              </label>
              <input
                id="goal-title"
                className="goals-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t("goals.goalNamePlaceholder")}
                required
                autoFocus
              />
            </div>

            <div className="goals-field">
              <label className="goals-label" htmlFor="goal-amount">
                {t("goals.targetAmount")}
              </label>
              <input
                id="goal-amount"
                className="goals-input"
                type="number"
                inputMode="numeric"
                min="1"
                step="1"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="0"
                required
              />
            </div>

            {formError && <p className="goals-form-error">{formError}</p>}

            <div className="goals-form-actions">
              <button
                type="button"
                className="goals-form-cancel"
                onClick={closeForm}
              >
                {t("goals.cancel")}
              </button>
              <button
                type="submit"
                className="goals-form-save"
                disabled={submitting}
              >
                {submitting ? t("common.loading") : t("goals.save")}
              </button>
            </div>
          </form>
        )}

        {/* Goal list */}
        {!loading && goals.length === 0 && (
          <p className="goals-empty">{t("goals.noGoals")}</p>
        )}

        <ul className="goals-list">
          {[...goals]
            .sort((a, b) => (a.achieved_at ? 1 : 0) - (b.achieved_at ? 1 : 0))
            .map((goal) => {
              const isAchieved = !!goal.achieved_at;
              const percent = Math.min(
                100,
                Math.max(0, (balance / goal.target_amount) * 100),
              );

              return (
                <li
                  key={goal.id}
                  className={`goal-card${isAchieved ? " goal-card--achieved" : ""}`}
                >
                  <div className="goal-card-header">
                    <span className="goal-name">
                      {isAchieved && (
                        <IoIosCheckmarkCircle
                          size={20}
                          color="var(--color-primary)"
                          style={{ marginRight: 4, flexShrink: 0 }}
                        />
                      )}
                      {goal.title}
                    </span>
                    <button
                      type="button"
                      className="goal-delete-btn"
                      onClick={() => handleDelete(goal)}
                      aria-label={t("goals.delete")}
                    >
                      ✕
                    </button>
                  </div>

                  <ProgressBar
                    value={percent}
                    color={isAchieved ? "#fada66" : "#ffe792"}
                  />

                  <div className="goal-progress-label">
                    {t("goals.progress", {
                      current: balance.toLocaleString(),
                      target: goal.target_amount.toLocaleString(),
                    })}
                    {isAchieved && (
                      <span className="goal-achieved-badge">
                        {t("goals.achieved")}
                      </span>
                    )}
                  </div>

                  {!isAchieved && percent >= 100 && (
                    <button
                      type="button"
                      className="goal-achieve-btn"
                      onClick={() => handleMarkAchieved(goal)}
                    >
                      {t("goals.markAchieved")}
                    </button>
                  )}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};
