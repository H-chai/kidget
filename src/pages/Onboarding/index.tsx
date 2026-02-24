import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { supabase } from '../../lib/supabase';
import { Mascot } from '../../components/ui/Mascot';
import './Onboarding.css';

const MASCOT_COLORS = ['#3C87D5', '#6EE057', '#A057E0', '#EA60CF', '#F18334'];

export const OnboardingPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { refetchProfile } = useProfile();
  const navigate = useNavigate();

  const [color, setColor] = useState(MASCOT_COLORS[0]);
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
      avatar_emoji: color,
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
          <h1 className="onboarding-title">{t('onboarding.title')}</h1>
          <p className="onboarding-subtitle">{t('onboarding.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Avatar picker: mascot preview + color swatches */}
          <div>
            <p className="onboarding-label">{t('onboarding.avatarLabel')}</p>
            <div className="mascot-picker">
              <div className="mascot-preview">
                <Mascot color={color} width={110} height={137} />
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
