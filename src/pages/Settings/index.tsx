import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaRegTrashAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { supabase } from '../../lib/supabase';
import { Mascot } from '../../components/ui/Mascot';
import './Settings.css';

const MASCOT_COLORS = ['#3C87D5', '#6EE057', '#A057E0', '#EA60CF', '#F18334'];

export const SettingsPage = () => {
  const { t } = useTranslation();
  const { user, signOut } = useAuth();
  const { profile, refetchProfile } = useProfile();
  const navigate = useNavigate();

  const [color, setColor] = useState(profile?.avatar_emoji ?? MASCOT_COLORS[0]);
  const [name, setName] = useState(profile?.name ?? '');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSave = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!name.trim()) return;

    await supabase
      .from('profiles')
      .update({ name: name.trim(), avatar_emoji: color })
      .eq('user_id', user!.id);

    await refetchProfile();
    navigate('/', { replace: true });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login', { replace: true });
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    await supabase.rpc('delete_user');
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
          <div className="mascot-picker">
            <div className="mascot-preview">
              <Mascot color={color} width={90} height={112} />
            </div>
            <div className="mascot-color-swatches">
              {MASCOT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  className={`mascot-swatch${color === c ? ' mascot-swatch--selected' : ''}`}
                  style={{ background: c }}
                  onClick={() => setColor(c)}
                  aria-label={c}
                />
              ))}
            </div>
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

      {/* Sign out / Delete section */}
      <div className="settings-section">
        <button type="button" className="settings-signout-btn" onClick={handleSignOut}>
          {t('settings.signOut')}
        </button>
        <button type="button" className="settings-delete-btn" onClick={() => setShowDeleteDialog(true)}>
          {t('settings.deleteAccount')}
        </button>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteDialog && (
        <div className="delete-dialog-overlay" onClick={() => setShowDeleteDialog(false)}>
          <div className="delete-dialog" onClick={e => e.stopPropagation()}>
            <div className="delete-dialog-icon">
              <FaRegTrashAlt size={24} color="#fff" />
            </div>
            <h2 className="delete-dialog-title">{t('settings.deleteAccountTitle')}</h2>
            <p className="delete-dialog-body">{t('settings.deleteAccountConfirm')}</p>
            <div className="delete-dialog-actions">
              <button
                type="button"
                className="delete-dialog-cancel"
                onClick={() => setShowDeleteDialog(false)}
              >
                {t('common.cancel')}
              </button>
              <button
                type="button"
                className="delete-dialog-confirm"
                onClick={handleDeleteAccount}
                disabled={deleting}
              >
                {deleting ? t('common.loading') : t('settings.deleteAccount')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
