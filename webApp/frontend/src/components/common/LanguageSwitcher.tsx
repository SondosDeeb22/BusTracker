//===============================================================================================
//? Importing
//===============================================================================================
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GlobeAltIcon } from '@heroicons/react/24/outline';


//===============================================================================================

type SupportedLanguage = 'en' | 'tr';

// we only allow english and turkish for this web applicaiton , (code -> is what is use, and lable -> is value to be displayed)

const LANGUAGES: Array<{ code: SupportedLanguage; label: string }> = [
  { code: 'en', label: 'EN' },
  { code: 'tr', label: 'TR' }
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  // Ref to the wrapper div so we can detect clicks outside of it
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Current language code.
  // - resolvedLanguage is the final language after detection/fallback
  // - language is the current configured language
  // We default to 'en' if nothing is set
  const current = (i18n.resolvedLanguage || i18n.language || 'en') as SupportedLanguage;

  // 
  // change app language: In `i18n.js`file i configured the language detector to cache
  // in localStorage under `i18nextLng`, so the selection persists after refresh
  const changeLanguage = async (lng: SupportedLanguage) => {
    await i18n.changeLanguage(lng);
  };

  const nextLang = (LANGUAGES.find((l) => l.code !== current) ?? LANGUAGES[0]) as {
    code: SupportedLanguage;
    label: string;
  };

  return (
    <div ref={wrapperRef} className="relative inline-flex items-center gap-2">
      <button
      key={nextLang.label}
      type='button'
      onClick={() => changeLanguage(nextLang.code)}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-white/95">
        <GlobeAltIcon className="h-5 w-5" />
        <span className="text-sm font-semibold">{nextLang.label}</span>
      </button>

    </div>
  );
};


//===============================================================================================

export default LanguageSwitcher;
