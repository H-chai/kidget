import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { TiStarFullOutline } from "react-icons/ti";
import { FaMoneyBill1Wave } from "react-icons/fa6";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { MascotFace } from "../../components/ui/MascotFace";
import { supabase } from "../../lib/supabase";
import type { TransactionType } from "../../types";
import { TRANSACTION_ICONS } from "../../constants/icons";
import "./AddTransaction.css";

const todayStr = (): string => new Date().toISOString().slice(0, 10);

export const AddTransactionPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const navigate = useNavigate();

  const [type, setType] = useState<TransactionType>("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(todayStr);
  const [icon, setIcon] = useState<string | null>(TRANSACTION_ICONS[0].id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isIncome = type === "income";

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);

    const amountInt = parseInt(amount, 10);
    if (!amountInt || amountInt <= 0) {
      setError(t("addTransaction.invalidAmount"));
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.from("transactions").insert({
      user_id: user!.id,
      type,
      amount: amountInt,
      description: description.trim(),
      date,
      icon,
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
    } else {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="add-page">
      <div className="add-page-inner">
        {/* Header */}
        <div className="add-header">
          <div className="page-heading">
            <MascotFace
              color={profile?.avatar_emoji ?? "#3C87D5"}
              width={32}
              height="auto"
              className="page-heading-mascot"
            />
            <h1 className="add-title">
              {isIncome
                ? t("addTransaction.income")
                : t("addTransaction.expense")}
            </h1>
          </div>
          <button
            className="add-cancel"
            type="button"
            onClick={() => navigate(-1)}
          >
            {t("addTransaction.cancel")}
          </button>
        </div>

        {/* Type toggle */}
        <div className="type-toggle">
          <button
            type="button"
            className={`type-btn${isIncome ? " type-btn--active-income" : ""}`}
            onClick={() => setType("income")}
          >
            <TiStarFullOutline
              size={18}
              color="#ffc800"
              style={{ marginRight: 4 }}
            />
            {t("addTransaction.income")}
          </button>
          <button
            type="button"
            className={`type-btn${!isIncome ? " type-btn--active-expense" : ""}`}
            onClick={() => setType("expense")}
          >
            <FaMoneyBill1Wave
              size={16}
              color="#1EB400"
              style={{ marginRight: 4 }}
            />{" "}
            {t("addTransaction.expense")}
          </button>
        </div>

        <form className="add-form" onSubmit={handleSubmit}>
          {/* Amount */}
          <div className="add-field">
            <label className="add-label" htmlFor="amount">
              {t("addTransaction.amount")}
            </label>
            <input
              id="amount"
              className="add-input add-input--amount"
              type="number"
              inputMode="numeric"
              min="1"
              step="1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="add-field">
            <label className="add-label" htmlFor="description">
              {t("addTransaction.description")}
            </label>
            <input
              id="description"
              className="add-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={
                isIncome
                  ? t("addTransaction.descriptionPlaceholderIncome")
                  : t("addTransaction.descriptionPlaceholderExpense")
              }
              required
            />
          </div>

          {/* Icon picker */}
          <div className="add-field">
            <label className="add-label">{t("addTransaction.icon")}</label>
            <div className="icon-picker">
              {TRANSACTION_ICONS.map(({ id, Component, bg, color }) => (
                <button
                  key={id}
                  type="button"
                  className={`icon-picker-btn${icon === id ? " icon-picker-btn--selected" : ""}`}
                  style={{ background: bg }}
                  onClick={() => setIcon(id)}
                  aria-label={id}
                >
                  <Component size={20} color={color} />
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="add-field">
            <label className="add-label" htmlFor="date">
              {t("addTransaction.date")}
            </label>
            <input
              id="date"
              className="add-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          {error && <p className="add-error">{error}</p>}

          <button
            type="submit"
            className={`add-submit${!isIncome ? " add-submit--expense" : ""}`}
            disabled={submitting}
          >
            {submitting ? t("common.loading") : t("addTransaction.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};
