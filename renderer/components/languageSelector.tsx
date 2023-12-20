import React, { useState, useEffect } from 'react';
import { SelectMenu, Button } from 'evergreen-ui';
import { useTranslation } from 'react-i18next';
import { useLanguage } from './languageContext';

export default function LanguageSelector() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState("fr");
  const { changeLanguage } = useLanguage();

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
    {
      label: "languageSelector_russian",
      value: "ru",
      icon: "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Flag_of_Russia.svg/800px-Flag_of_Russia.svg.png?20120812153731",
    },
    // Ajoutez plus de langues ici
  ];

  useEffect(() => {
    i18n.changeLanguage(language);
    changeLanguage(language);
  }, [language, i18n]);

  // Mise à jour du label sélectionné en fonction de la langue actuelle
  useEffect(() => {
    const currentLanguageOption = languageOptions.find(option => option.value === language);
    if (currentLanguageOption) {
      setSelected(t(currentLanguageOption.label));
    }
  }, [language, t]);

  const [selected, setSelected] = useState(t("languageSelector_english"));

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
