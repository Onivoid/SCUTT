import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext({
  language: 'fr',
  changeLanguage: (lang: string) => {}
});

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('fr');

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
