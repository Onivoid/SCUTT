// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import esTranslation from './locales/es.json';
import deTranslation from './locales/de.json';
import itaTranslation from './locales/ita.json';
import ruTranslation from './locales/ru.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fr: { translation: frTranslation },
      es: { translation: esTranslation },
      de: { translation: deTranslation },
      ita: { translation: itaTranslation },
      ru: { translation: ruTranslation },
      // ... autres langues
    },
    lng: "en", // langue initiale
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
