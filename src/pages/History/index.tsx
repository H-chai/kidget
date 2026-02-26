import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdKeyboardArrowDown } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { supabase } from "../../lib/supabase";
import { useTransactions } from "../../hooks/useTransactions";
import { TransactionIcon } from "../../components/ui/TransactionIcon";
import { MascotFace } from "../../components/ui/MascotFace";
import { LoadingScreen } from "../../components/layout/LoadingScreen";
import type { Transaction, TransactionType } from "../../types";
import "./History.css";

const formatMonth = (ym: string): string => {
  const [year, month] = ym.split("-").map(Number);
  const currentYear = new Date().getFullYear();
  const options: Intl.DateTimeFormatOptions =
    year === currentYear
      ? { month: "long" }
      : { month: "short", year: "numeric" };
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", options);
};

export const HistoryPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { transactions, loading, refetch } = useTransactions(user!.id);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [editType, setEditType] = useState<TransactionType>("income");
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

  const groupedMonths = useMemo(() => {
    const months = [
      ...new Set(transactions.map((tx) => tx.date.slice(0, 7))),
    ].sort((a, b) => b.localeCompare(a));
    return months.map((month) => {
      const txs = transactions.filter((tx) => tx.date.startsWith(month));
      const income = txs
        .filter((tx) => tx.type === "income")
        .reduce((s, tx) => s + tx.amount, 0);
      const expense = txs
        .filter((tx) => tx.type === "expense")
        .reduce((s, tx) => s + tx.amount, 0);
      return { month, label: formatMonth(month), txs, income, expense };
    });
  }, [transactions]);

  const totalIncome = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "income")
        .reduce((s, tx) => s + tx.amount, 0),
    [transactions],
  );

  const totalExpense = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "expense")
        .reduce((s, tx) => s + tx.amount, 0),
    [transactions],
  );

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => {
      const next = new Set(prev);
      if (next.has(month)) next.delete(month);
      else next.add(month);
      return next;
    });
  };

  const startEdit = (tx: Transaction) => {
    setConfirmDeleteId(null);
    setEditingId(tx.id);
    setEditType(tx.type);
    setEditAmount(String(tx.amount));
    setEditDescription(tx.description);
    setEditDate(tx.date);
    setExpandedMonths((prev) => new Set([...prev, tx.date.slice(0, 7)]));
  };

  const cancelEdit = () => setEditingId(null);

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    const amountInt = parseInt(editAmount, 10);
    if (!amountInt || amountInt <= 0) return;

    setSaving(true);
    await supabase
      .from("transactions")
      .update({
        type: editType,
        amount: amountInt,
        description: editDescription.trim(),
        date: editDate,
      })
      .eq("id", editingId!);
    setSaving(false);
    setEditingId(null);
    refetch();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("transactions").delete().eq("id", id);
    refetch();
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="history-page">
      <div className="history-page-inner">
        <div className="history-heading">
          <MascotFace
            color={profile?.avatar_emoji ?? "#3C87D5"}
            width={32}
            height="auto"
            className="history-heading-mascot"
          />
          <h1 className="history-title">{t("history.title")}</h1>
        </div>

        {transactions.length > 0 && (
          <div className="history-balance-card">
            <p className="history-balance-label">{t("history.balance")}</p>
            <div className="history-balance-row">
              <div className="history-balance-item">
                <span className="history-balance-amount history-balance-amount--income">
                  +{totalIncome}
                </span>
                <span className="history-balance-sublabel">
                  {t("history.income")}
                </span>
              </div>
              <div className="history-balance-divider" />
              <div className="history-balance-item">
                <span className="history-balance-amount history-balance-amount--expense">
                  −{totalExpense}
                </span>
                <span className="history-balance-sublabel">
                  {t("history.expense")}
                </span>
              </div>
            </div>
          </div>
        )}

        {groupedMonths.length === 0 ? (
          <p className="history-empty">{t("history.noTransactions")}</p>
        ) : (
          <div className="month-groups">
            {groupedMonths.map(({ month, label, txs, income, expense }) => {
              const isOpen = expandedMonths.has(month);
              return (
                <div key={month} className="month-group">
                  <button
                    type="button"
                    className="month-group-header"
                    onClick={() => toggleMonth(month)}
                  >
                    <span className="month-group-label">{label}</span>
                    <div className="month-group-amounts">
                      {income > 0 && (
                        <span className="month-group-income">+{income}</span>
                      )}
                      {expense > 0 && (
                        <span className="month-group-expense">−{expense}</span>
                      )}
                    </div>
                    <MdKeyboardArrowDown
                      size={22}
                      className={`month-group-chevron${isOpen ? " month-group-chevron--open" : ""}`}
                    />
                  </button>

                  {isOpen && (
                    <div className="month-group-body">
                      <div className="history-list">
                        {txs.map((tx) => (
                          <div
                            key={tx.id}
                            className={`history-item${editingId === tx.id ? " history-item--editing" : ""}`}
                          >
                            {editingId === tx.id ? (
                              <form
                                className="history-edit-form"
                                onSubmit={handleSave}
                              >
                                <div className="edit-type-row">
                                  <button
                                    type="button"
                                    className={`edit-type-btn${editType === "income" ? " edit-type-btn--income" : ""}`}
                                    onClick={() => setEditType("income")}
                                  >
                                    ⭐ {t("addTransaction.income")}
                                  </button>
                                  <button
                                    type="button"
                                    className={`edit-type-btn${editType === "expense" ? " edit-type-btn--expense" : ""}`}
                                    onClick={() => setEditType("expense")}
                                  >
                                    💸 {t("addTransaction.expense")}
                                  </button>
                                </div>

                                <input
                                  className="edit-input"
                                  type="text"
                                  value={editDescription}
                                  onChange={(e) =>
                                    setEditDescription(e.target.value)
                                  }
                                  placeholder={t("addTransaction.description")}
                                  required
                                  autoFocus
                                />

                                <div className="edit-amount-date-row">
                                  <input
                                    className="edit-input edit-input--amount"
                                    type="number"
                                    inputMode="numeric"
                                    min="1"
                                    step="1"
                                    value={editAmount}
                                    onChange={(e) =>
                                      setEditAmount(e.target.value)
                                    }
                                    required
                                  />
                                  <input
                                    className="edit-input edit-input--date"
                                    type="date"
                                    value={editDate}
                                    onChange={(e) =>
                                      setEditDate(e.target.value)
                                    }
                                    required
                                  />
                                </div>

                                <div className="edit-actions">
                                  <button
                                    type="button"
                                    className="edit-cancel-btn"
                                    onClick={cancelEdit}
                                  >
                                    {t("common.cancel")}
                                  </button>
                                  <button
                                    type="submit"
                                    className="edit-save-btn"
                                    disabled={saving}
                                  >
                                    {saving
                                      ? t("common.loading")
                                      : t("common.save")}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <TransactionIcon
                                  icon={tx.icon}
                                  type={tx.type}
                                  size={36}
                                />
                                <div className="history-desc">
                                  <p className="history-description">
                                    {tx.description}
                                  </p>
                                  <p className="history-date">{tx.date}</p>
                                </div>

                                {confirmDeleteId === tx.id ? (
                                  <div className="delete-confirm-inline">
                                    <span className="delete-confirm-question">
                                      {t("history.deleteConfirm")}
                                    </span>
                                    <button
                                      type="button"
                                      className="delete-keep-btn"
                                      onClick={() => setConfirmDeleteId(null)}
                                    >
                                      {t("common.cancel")}
                                    </button>
                                    <button
                                      type="button"
                                      className="delete-yes-btn"
                                      onClick={() => handleDelete(tx.id)}
                                    >
                                      {t("common.delete")}
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span
                                      className={`history-amount history-amount--${tx.type}`}
                                    >
                                      {tx.type === "income" ? "+" : "−"}
                                      {tx.amount}
                                    </span>
                                    <button
                                      type="button"
                                      className="history-action-btn history-action-btn--edit"
                                      onClick={() => startEdit(tx)}
                                      aria-label={t("common.edit")}
                                    >
                                      ✎
                                    </button>
                                    <button
                                      type="button"
                                      className="history-action-btn history-action-btn--delete"
                                      onClick={() => setConfirmDeleteId(tx.id)}
                                      aria-label={t("common.delete")}
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
