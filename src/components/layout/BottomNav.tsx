import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './layout.css';

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? ' nav-item--active' : ''}`;

const fabClass = ({ isActive }: { isActive: boolean }) =>
  `nav-fab${isActive ? ' nav-fab--active' : ''}`;

export const BottomNav = () => {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={navItemClass}>
        <span className="nav-icon">🏠</span>
        <span className="nav-label">{t('nav.overview')}</span>
      </NavLink>

      <NavLink to="/history" className={navItemClass}>
        <span className="nav-icon">📋</span>
        <span className="nav-label">{t('nav.history')}</span>
      </NavLink>

      <NavLink to="/add" className={fabClass} aria-label={t('addTransaction.title')}>
        ＋
      </NavLink>

      <NavLink to="/badges" className={navItemClass}>
        <span className="nav-icon">🏅</span>
        <span className="nav-label">{t('nav.badges')}</span>
      </NavLink>

      <NavLink to="/goals" className={navItemClass}>
        <span className="nav-icon">🎯</span>
        <span className="nav-label">{t('nav.goals')}</span>
      </NavLink>
    </nav>
  );
};
