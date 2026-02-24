import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { supabase } from '../../lib/supabase';
import { AVATAR_EMOJIS } from '../../constants/avatars';
import './Onboarding.css';

export const OnboardingPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { refetchProfile } = useProfile();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(AVATAR_EMOJIS[0]);
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase.from('profiles').upsert({
      user_id: user!.id,
      name: name.trim(),
      avatar_emoji: avatar,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      await refetchProfile();
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">

        <div className="onboarding-header">
          <div className="onboarding-hero">🎉</div>
          <h1 className="onboarding-title">{t('onboarding.title')}</h1>
          <p className="onboarding-subtitle">{t('onboarding.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Avatar picker */}
          <div>
            <p className="onboarding-label">{t('onboarding.avatarLabel')}</p>
            <div className="avatar-grid">
              {AVATAR_EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  className={`avatar-btn${avatar === emoji ? ' avatar-btn--selected' : ''}`}
                  onClick={() => setAvatar(emoji)}
                  aria-label={emoji}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <p className="onboarding-label">{t('onboarding.nameLabel')}</p>
            <input
              className="onboarding-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder={t('onboarding.namePlaceholder')}
              maxLength={30}
              required
              autoFocus
            />
          </div>

          {error && <p className="onboarding-error">{error}</p>}

          <button type="submit" className="onboarding-submit" disabled={saving}>
            {saving ? t('onboarding.saving') : t('onboarding.submit')}
          </button>

        </form>
      </div>
    </div>
  );
};
