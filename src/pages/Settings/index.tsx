import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { supabase } from '../../lib/supabase';
import { AVATAR_EMOJIS } from '../../constants/avatars';
import './Settings.css';

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { profile, refetchProfile } = useProfile();
  const navigate = useNavigate();

  const [avatar, setAvatar] = useState(profile?.avatar_emoji ?? AVATAR_EMOJIS[0]);
  const [name, setName] = useState(profile?.name ?? '');
  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!name.trim()) return;

    await supabase
      .from('profiles')
      .update({ name: name.trim(), avatar_emoji: avatar })
      .eq('user_id', user!.id);

    await refetchProfile();
    navigate('/', { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  return (
    <div className="settings-page">
      <h1 className="settings-title">{t('settings.title')}</h1>

      {/* Profile section */}
      <form className="settings-section" onSubmit={handleSave}>
        <p className="settings-section-title">{t('settings.profileSection')}</p>

        {/* Avatar picker */}
        <div className="settings-field">
          <span className="settings-label">{t('settings.avatarLabel')}</span>
          <div className="settings-avatar-grid">
            {AVATAR_EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                className={`settings-avatar-btn${avatar === emoji ? ' settings-avatar-btn--selected' : ''}`}
                onClick={() => setAvatar(emoji)}
                aria-label={emoji}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div className="settings-field">
          <label className="settings-label" htmlFor="settings-name">
            {t('settings.nameLabel')}
          </label>
          <input
            id="settings-name"
            className="settings-input"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t('settings.namePlaceholder')}
            maxLength={30}
            required
          />
        </div>

        <button type="submit" className="settings-save-btn">
          {t('settings.save')}
        </button>
      </form>

      {/* Sign out section */}
      <div className="settings-section">
        <button type="button" className="settings-signout-btn" onClick={handleSignOut}>
          {t('settings.signOut')}
        </button>
      </div>

    </div>
  );
};
