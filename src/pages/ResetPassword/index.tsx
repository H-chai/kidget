import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import trioLeft from "../../assets/mascots/trio/trio-left.svg";
import trioCenter from "../../assets/mascots/trio/trio-center.svg";
import trioRight from "../../assets/mascots/trio/trio-right.svg";
import "../auth.css";

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await updatePassword(password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      navigate("/login", { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-mascots">
        <img src={trioLeft} alt="" className="auth-mascot auth-mascot--side" />
        <img src={trioCenter} alt="" className="auth-mascot auth-mascot--center" />
        <img src={trioRight} alt="" className="auth-mascot auth-mascot--side" />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">{t("auth.resetPasswordTitle")}</h1>
          <p className="auth-subtitle">{t("auth.resetPasswordSubtitle")}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              {t("auth.newPassword")}
            </label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <span className="auth-hint">{t("auth.passwordHint")}</span>
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={submitting}>
            {submitting ? t("auth.settingPassword") : t("auth.setPassword")}
          </button>
        </form>
      </div>
    </div>
  );
};
