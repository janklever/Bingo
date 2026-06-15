import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

const LANGUAGES = [
  { code: 'pt', label: 'Português', flag: '🇧🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'es', label: 'Español', flag: '🇪🇸' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const currentLanguage = LANGUAGES.find(lang => lang.code === (i18n.resolvedLanguage || i18n.language)) || LANGUAGES[0];

  const handleLanguageChange = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher-container" ref={containerRef}>
      <button
        type="button"
        className="language-switcher-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="lang-flag">{currentLanguage.flag}</span>
        <span className="lang-code">{currentLanguage.code.toUpperCase()}</span>
        <span className={`lang-arrow ${isOpen ? 'is-open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <ul className="language-switcher-dropdown" role="listbox">
          {LANGUAGES.map((lang) => (
            <li key={lang.code} role="option" aria-selected={lang.code === currentLanguage.code}>
              <button
                type="button"
                className={`language-option-btn ${lang.code === currentLanguage.code ? 'is-active' : ''}`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="option-flag">{lang.flag}</span>
                <span className="option-label">{lang.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
