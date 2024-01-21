import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "./languageContext";
import { SelectMenu, Button, Spinner } from "evergreen-ui";
import Style from "../styles/modules/diskSelector.module.css";

export default function DiskSelector({disks, setSelectedDisk, isScanning}: {disks: Array<string> | null, setSelectedDisk: Function, isScanning: boolean}) {
  const { t, i18n } = useTranslation();
  const { language } = useLanguage();
  const [selected, setSelected] = useState(null);
  
  const diskHandler = (value) => {
    setSelected(value);
    setSelectedDisk(value);
  };

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language, i18n]);

  return disks ? (
    <SelectMenu
      closeOnSelect={true}
      title={t("diskSelector_title")}
      options={disks.map(
        (label) => ({ label, value: label })
      )}
      selected={selected}
      onSelect={(item) => {diskHandler(item.value)}}
    >
      <Button disabled={isScanning}>{selected || t("diskSelector_menuTitle")}</Button>
    </SelectMenu>
  ) : (
    <Spinner size={24} className={Style.spinner} />
  )
}
