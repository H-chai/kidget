import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import '../auth.css';

export const SignupPage = () => {
  const { t } = useTranslation();
  const { signUp, session, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/" replace />;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const { error, needsConfirmation } = await signUp(email, password);
    if (error) {
      setError(error);
      setSubmitting(false);
    } else if (needsConfirmation) {
      setConfirmationSent(true);
      setSubmitting(false);
    }
    // if no error and no confirmation needed, onAuthStateChange will update
    // session and the `if (session)` guard above will redirect to "/"
  };

  if (confirmationSent) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">📬</div>
            <h1 className="auth-title">{t('auth.checkEmailTitle')}</h1>
          </div>
          <p className="auth-success">{t('auth.checkEmailBody', { email })}</p>
          <div className="auth-footer">
            <Link className="auth-link" to="/login">
              {t('auth.loginLink')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🐷</div>
          <h1 className="auth-title">{t('auth.signupTitle')}</h1>
          <p className="auth-subtitle">{t('auth.signupSubtitle')}</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              {t('auth.email')}
            </label>
            <input
              id="email"
              className="auth-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              {t('auth.password')}
            </label>
            <input
              id="password"
              className="auth-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button className="auth-button" type="submit" disabled={submitting}>
            {submitting ? t('auth.signingUp') : t('auth.signup')}
          </button>
        </form>

        <div className="auth-footer">
          {t('auth.haveAccount')}{' '}
          <Link className="auth-link" to="/login">
            {t('auth.loginLink')}
          </Link>
        </div>
      </div>
    </div>
  );
};
