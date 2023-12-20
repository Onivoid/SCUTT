import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./languageContext";
import { SelectMenu, Button } from "evergreen-ui";

export default function GameVersionSelector({setGameVersion}) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState(null);
  const gameVersionList = require("../../main/helpers/gameVersionList.json");
  
  const gameVersionHandler = (value) => {
    setGameVersion(value)
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return (
    <SelectMenu
      closeOnSelect={true}
      title="Sélectrionner une version"
      options={gameVersionList.map(
        (label) => ({ label, value: label })
      )}
      selected={selected}
      onSelect={(item) => {setSelected(item.value);gameVersionHandler(item.value)}}
    >
      <Button>{selected || "Sélectionner une version ..."}</Button>
    </SelectMenu>
  );
}
