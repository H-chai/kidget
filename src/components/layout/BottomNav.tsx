import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdHomeFilled, MdEventNote } from "react-icons/md";
import { RiMedalFill } from "react-icons/ri";
import { LuGoal } from "react-icons/lu";
import { useProfile } from "../../context/ProfileContext";
import "./layout.css";

const navItemClass = ({ isActive }: { isActive: boolean }) =>
  `nav-item${isActive ? " nav-item--active" : ""}`;

const fabClass = ({ isActive }: { isActive: boolean }) =>
  `nav-fab${isActive ? " nav-fab--active" : ""}`;

export const BottomNav = () => {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const location = useLocation();
  const userColor = profile?.avatar_emoji ?? "var(--color-primary)";
  const navBg = ["/history", "/badges"].includes(location.pathname) ? "var(--color-surface-app)" : undefined;

  return (
    <nav
      className="bottom-nav"
      style={{ "--user-color": userColor, background: navBg } as React.CSSProperties}
    >
      <div className="bottom-nav-inner">
        <NavLink to="/" end className={navItemClass}>
          <MdHomeFilled className="nav-icon" />
          <span className="nav-label">{t("nav.overview")}</span>
        </NavLink>

        <NavLink to="/history" className={navItemClass}>
          <MdEventNote className="nav-icon" />
          <span className="nav-label">{t("nav.history")}</span>
        </NavLink>

        <NavLink
          to="/add"
          className={fabClass}
          aria-label={t("addTransaction.title")}
        >
          ＋
        </NavLink>

        <NavLink to="/badges" className={navItemClass}>
          <RiMedalFill className="nav-icon" />
          <span className="nav-label">{t("nav.badges")}</span>
        </NavLink>

        <NavLink to="/goals" className={navItemClass}>
          <LuGoal className="nav-icon" />
          <span className="nav-label">{t("nav.goals")}</span>
        </NavLink>
      </div>
    </nav>
  );
};
