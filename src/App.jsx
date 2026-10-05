import { useEffect, useState } from 'react';
import Journey from './Journey.jsx';
import { ui } from './scenes';
//LANG OPTION
const readLang = () => {
  try {
    const saved = localStorage.getItem('saudi-coffee-lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    /* storage can be blocked; fall back to Arabic */
  }
  return 'ar';
};


function Cup() {
  return (
    <svg viewBox="0 0 64 64" width="26" height="26" aria-hidden="true">
      <path d="M18 30h28l-3 15a7 7 0 0 1-7 5h-8a7 7 0 0 1-7-5z" fill="currentColor" />
      <path
        d="M27 19c-3 3 3 5 0 9M37 17c-3 3 3 5 0 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        opacity=".7"
      />
    </svg>
  );
}

export default function App() {
  const [lang, setLang] = useState(readLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    try {
      localStorage.setItem('saudi-coffee-lang', lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  return (
    <>
      <header className="top">
        <span className="brand">
          <Cup />
          <span>{ui[lang].brand}</span>
        </span>
        <button
          type="button"
          className="lang"
          aria-label={ui[lang].toggleLabel}
          onClick={() => setLang(lang === 'ar' ? 'en' : 'ar')}
        >
          {ui[lang].toggle}
        </button>
      </header>
      <main>
        <Journey lang={lang} />
      </main>
    </>
  );
}
