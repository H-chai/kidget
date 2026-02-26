import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import trioLeft from "../../assets/mascots/trio/trio-left.svg";
import trioCenter from "../../assets/mascots/trio/trio-center.svg";
import trioRight from "../../assets/mascots/trio/trio-right.svg";
import "../auth.css";

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error } = await resetPassword(email);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      setSent(true);
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-mascots">
          <img src={trioLeft} alt="" className="auth-mascot auth-mascot--side" />
          <img src={trioCenter} alt="" className="auth-mascot auth-mascot--center" />
          <img src={trioRight} alt="" className="auth-mascot auth-mascot--side" />
        </div>
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">{t("auth.resetLinkSentTitle")}</h1>
          </div>
          <p className="auth-success">{t("auth.resetLinkSentBody", { email })}</p>
          <div className="auth-footer">
            <Link className="auth-link" to="/login">
              {t("auth.backToLogin")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-mascots">
        <img src={trioLeft} alt="" className="auth-mascot auth-mascot--side" />
        <img src={trioCenter} alt="" className="auth-mascot auth-mascot--center" />
        <img src={trioRight} alt="" className="auth-mascot auth-mascot--side" />
      </div>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">{t("auth.forgotPasswordTitle")}</h1>
          <p className="auth-subtitle">{t("auth.forgotPasswordSubtitle")}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              {t("auth.email")}
            </label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={submitting}>
            {submitting ? t("auth.sendingResetLink") : t("auth.sendResetLink")}
          </button>
        </form>

        <div className="auth-footer">
          <Link className="auth-link" to="/login">
            {t("auth.backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
};
