import React, { useState, useEffect } from 'react';
import { SelectMenu, Button } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './languageContext';
import UserPreferences from '../../main/database/class/UserPreferences';
import router from 'next/router';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("fr");
  const { changeLanguage } = useLanguage();
  const [selected, setSelected] = useState(t("languageSelector_french"));

  // Options pour les langues
  const languageOptions = [
    {
      label: "languageSelector_french",
      value: "fr",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Flag_of_France.png/800px-Flag_of_France.png",
    },
    {
      label: "languageSelector_english",
      value: "en",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Flag_of_the_United_Kingdom.png/800px-Flag_of_the_United_Kingdom.png",
    },
    {
      label: "languageSelector_spanish",
      value: "es",
      icon: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Spain_flag_300.png?20060514101634",
    },
    {
      label: "languageSelector_german",
      value: "de",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/800px-Flag_of_Germany.svg.png",
    },
    {
      label: "languageSelector_italian",
      value: "ita",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/800px-Flag_of_Italy.svg.png",
    },
  ];

  useEffect(() => {
    i18n.changeLanguage(language);
    changeLanguage(language);
    const currentLanguageOption = languageOptions.find(option => option.value === language);
    if (currentLanguageOption) {
      setSelected(t(currentLanguageOption.label));
    }
    window.ipc.send('choosed-language', { lang: currentLanguageOption.value });
  }, [language, i18n]);
  
  useEffect(() => {
    window.ipc.invoke('get-user-preferences').then(async (result: UserPreferences) => {
      let UiPreferences = result.UiPreferences;
      if (UiPreferences["choosedLanguage"]) {
        setLanguage(UiPreferences["choosedLanguage"]);
      } else {
        setLanguage('fr');
      }
    });
  }, []);


  return (
    <SelectMenu
      title={t("languageSelector_placeholder")}
      options={languageOptions.map(option => ({
        label: t(option.label),
        value: option.value,
        icon: option.icon,
      }))}
      selected={selected}
      onSelect={(item) => {
        setLanguage(String(item.value));
        setSelected(String(item.label));
      }}
    >
      <Button>{selected || t("languageSelector_placeholder")}</Button>
    </SelectMenu>
  );
}
