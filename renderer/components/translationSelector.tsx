import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./languageContext";
import { SelectMenu, Button } from "evergreen-ui";
import UserPreferences from "../../main/database/class/UserPreferences";

export default function translationSelector({setTranslation, setTranslationEnabled, translationEnabled}) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState(null);
  const [translations, setTranslations] = useState([]);
  
  const translationHandler = (name, value) => {
    setSelected(name);
    setTranslation(value);
  };

  const translationArrayHandler = (lang) => {
    window.ipc.invoke('get-user-preferences').then(async (result: UserPreferences) => {
      let UiPreferences = result.UiPreferences;
      if (UiPreferences["choosedTranslation"]) {
        window.ipc.invoke('get-translations').then((res) => {
          if (res[lang].enabled) {
            const choosedTranslation = UiPreferences["choosedTranslation"];
            const matchingTranslation = res[lang].links.find(link => link.name === choosedTranslation.name);
            if (matchingTranslation) {
              setTranslationEnabled(true);
              setTranslations(res[lang].links);
              setTranslation(matchingTranslation);
              setSelected(matchingTranslation.name); 
            } else {
              setTranslationEnabled(true);
              setTranslations(res[lang].links);
              setTranslation(res[lang].links[0]);
              setSelected(res[lang].links[0].name); 
            }
          } else {
            setTranslationEnabled(false);
            setSelected(null);
            setTranslation(null);
          }
        });
      } else {
        window.ipc.invoke('get-translations').then((res) => {
          if (res[lang].enabled) {
            setTranslationEnabled(true);
            setTranslations(res[lang].links);
            setTranslation(res[lang].links[0]);
            setSelected(res[lang].links[0].name); 
          } else {
            setTranslationEnabled(false);
            setSelected(null);
            setTranslation(null);
          }
        });
      }
    });
  }

  useEffect(() => {
    translationArrayHandler(i18n.language);
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
    translationArrayHandler(i18n.language);
  }, [language, i18n]);

  return (
    <SelectMenu
      closeOnSelect={true}
      title={t("translationSelector_title")}
      options={translationEnabled ? translations.map(
        (transObject, index) => ({ label: `${transObject.name}`, value: transObject })
      ): [{label: t("translationSelector_noTranslations"), value: null}]}
      selected={selected}
      onSelect={(item) => {translationHandler(item.label, item.value)}}
    >
      <Button disabled={!translationEnabled}>{selected || t("translationSelector_title")}</Button>
    </SelectMenu>
  );
}
