import fs from "fs";
import path from "path";
const translationsFolders = require("../../main/helpers/translationsFolders.json");

export default async function checkTranslationStatus(localisation: string, lang: string) {
  return new Promise((resolve, reject) => {
    const userCfgPath = path.join(localisation, "user.cfg");
    const LocalizationDir = path.join(localisation, "data", "Localization", translationsFolders[lang]);
    const globalIniPath = path.join(LocalizationDir, "global.ini");

    if (!fs.existsSync(userCfgPath) || !fs.existsSync(LocalizationDir) || !fs.existsSync(globalIniPath)) {
      resolve(false);
    } else {
      resolve(true);
    }
  });
}