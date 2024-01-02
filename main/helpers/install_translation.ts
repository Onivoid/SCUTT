import fs from "fs";
import path from "path";
import axios from "axios";
const translationsFolders = require("../../main/helpers/translationsFolders.json");

export default async function installTranslation(localization: string, lang: string) {
  
  const userCfgPath = path.join(localization, "user.cfg");
  const link = translationsFolders[lang].link;
  const folder = translationsFolders[lang].folder;

  if (!fs.existsSync(userCfgPath)) {
    await fs.writeFile(
      userCfgPath,
      `g_language = ${folder}\ng_languageAudio = english`,
      { encoding: "utf8" }, (err) => {
        if (err) throw err;
      }
    );
  }

  const localizationDir = path.join(localization, "data", "Localization", folder);
  if (!fs.existsSync(localizationDir)) {
    await fs.mkdir(path.join(localization, "data", "Localization", folder), { recursive: true }, (err) => {
      if (err) throw err;
    });
  }

  const outputPath = path.join(localizationDir, "global.ini");

  const response = await axios.get(link);

  fs.writeFileSync(outputPath, "\ufeff"+response.data);

  return true;
}