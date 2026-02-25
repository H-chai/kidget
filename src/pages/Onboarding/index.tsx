import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdLanguage, MdKeyboardArrowDown, MdCheck } from "react-icons/md";
import { useAuth } from "../../context/AuthContext";
import { useProfile } from "../../context/ProfileContext";
import { supabase } from "../../lib/supabase";
import trioLeft from "../../assets/mascots/trio/trio-left.svg";
import trioCenter from "../../assets/mascots/trio/trio-center.svg";
import trioRight from "../../assets/mascots/trio/trio-right.svg";
import { Mascot } from "../../components/ui/Mascot";
import "./Onboarding.css";

const MASCOT_COLORS = ["#3C87D5", "#6EE057", "#A057E0", "#EA60CF", "#F18334"];

export const OnboardingPage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { refetchProfile } = useProfile();
  const navigate = useNavigate();

  const [color, setColor] = useState(MASCOT_COLORS[0]);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!langOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [langOpen]);

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);

    const { error } = await supabase.from("profiles").upsert({
      user_id: user!.id,
      name: name.trim(),
      avatar_emoji: color,
    });

    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      await refetchProfile();
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="onboarding-page">
      {/* Language selector */}
      <div className="onboarding-lang" ref={langRef}>
        <button
          className="onboarding-lang-btn"
          onClick={() => setLangOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={langOpen}
        >
          <MdLanguage size={16} />
          <span>Language</span>
          <MdKeyboardArrowDown
            size={16}
            className={`onboarding-lang-chevron${langOpen ? " onboarding-lang-chevron--open" : ""}`}
          />
        </button>

        {langOpen && (
          <ul className="onboarding-lang-dropdown" role="listbox">
            <li className="onboarding-lang-item onboarding-lang-item--active" role="option" aria-selected>
              <span>English</span>
              <MdCheck size={14} />
            </li>
            <li className="onboarding-lang-item onboarding-lang-item--disabled" role="option" aria-disabled aria-selected={false}>
              <span>日本語</span>
              <span className="onboarding-lang-soon">Soon</span>
            </li>
          </ul>
        )}
      </div>

      {/* Mascot trio above card */}
      <div className="onboarding-mascots">
        <img src={trioLeft} alt="" className="onboarding-mascot onboarding-mascot--side" />
        <img src={trioCenter} alt="" className="onboarding-mascot onboarding-mascot--center" />
        <img src={trioRight} alt="" className="onboarding-mascot onboarding-mascot--side" />
      </div>

      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1 className="onboarding-title">{t("onboarding.title")}</h1>
          <p className="onboarding-subtitle">{t("onboarding.subtitle")}</p>
        </div>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          {/* Avatar picker: mascot preview + color swatches */}
          <div>
            <p className="onboarding-label">{t("onboarding.avatarLabel")}</p>
            <div className="mascot-picker">
              <div className="mascot-preview">
                <Mascot color={color} width={96} height={"auto"} />
              </div>
              <div className="mascot-color-swatches">
                {MASCOT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`mascot-swatch${color === c ? " mascot-swatch--selected" : ""}`}
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
            <p className="onboarding-label">{t("onboarding.nameLabel")}</p>
            <input
              className="onboarding-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("onboarding.namePlaceholder")}
              maxLength={30}
              required
              autoFocus
            />
          </div>

          {error && <p className="onboarding-error">{error}</p>}

          <button type="submit" className="onboarding-submit" disabled={saving}>
            {saving ? t("onboarding.saving") : t("onboarding.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};
