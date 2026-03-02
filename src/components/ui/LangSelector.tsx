import { useState, useRef, useEffect } from "react";
import { MdLanguage, MdKeyboardArrowDown, MdCheck } from "react-icons/md";
import i18n from "../../i18n";
import "./LangSelector.css";

const LANGS = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
  { code: "no", label: "Norsk" },
];

export const LangSelector = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const handleSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("kidget-lang", code);
    setLang(code);
    setOpen(false);
  };

  const currentLabel = LANGS.find((l) => l.code === lang)?.label ?? "Language";

  return (
    <div className="lang-sel" ref={ref}>
      <button
        type="button"
        className="lang-sel-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <MdLanguage size={16} />
        <span>{currentLabel}</span>
        <MdKeyboardArrowDown
          size={16}
          className={`lang-sel-chevron${open ? " lang-sel-chevron--open" : ""}`}
        />
      </button>

      {open && (
        <ul className="lang-sel-dropdown" role="listbox">
          {LANGS.map(({ code, label }) => (
            <li
              key={code}
              className={`lang-sel-item${lang === code ? " lang-sel-item--active" : ""}`}
              role="option"
              aria-selected={lang === code}
              onClick={() => handleSelect(code)}
            >
              <span>{label}</span>
              {lang === code && <MdCheck size={14} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
