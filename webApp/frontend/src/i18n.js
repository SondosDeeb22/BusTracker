// This file contains all configurations for our translation system for i18n (internationalization)

//================================================================================================================
//? Importing
//====================================================================================
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'en',
    supportedLngs: ['en', 'tr'],
    defaultNS: 'translation',
    ns: ['translation', 'auth/common', 'auth/loginPage', 'auth/forgot-passwordPage', 'auth/resetPasswordPage', 'auth/setPasswordPage', 'homepage/operatingBuses', 'header', 'drivers', 'routes', 'stations', 'buses', 'busScedule', 'servicePatterns', 'Tabele'],
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },
    interpolation: {
      escapeValue: false
    },
    returnObjects: true
  });

export default i18n;