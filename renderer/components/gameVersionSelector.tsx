import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./languageContext";
import { SelectMenu, Button } from "evergreen-ui";
import UserPreferences from "../../main/database/class/UserPreferences";

export default function GameVersionSelector({setGameVersion}) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState(null);
  const gameVersionList = require("../../main/helpers/gameVersionList.json");
  
  const gameVersionHandler = (value) => {
    setSelected(value);
    setGameVersion(value);
    window.ipc.send('last-gameVersion', {gameVersion: value});
  };

  useEffect(() => {
    window.ipc.invoke('get-user-preferences').then(async (result: UserPreferences) => {
      let UiPreferences = result.UiPreferences;
      if (UiPreferences["SaveLastPage?"] && UiPreferences["LastVisitedPage"] === "/translate" && UiPreferences["LastGameVersion"]) {
        if (UiPreferences["LastGameVersion"]) {
          setSelected(UiPreferences["LastGameVersion"]);
          setGameVersion(UiPreferences["LastGameVersion"]);
        }
      }
    });
  }, []);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <SelectMenu
      closeOnSelect={true}
      title={t("gameVersionSelector_title")}
      options={gameVersionList.map(
        (label) => ({ label, value: label })
      )}
      selected={selected}
      onSelect={(item) => {gameVersionHandler(item.value)}}
    >
      <Button>{selected || t("gameVersionSelector_menuTitle")}</Button>
    </SelectMenu>
  );
}
