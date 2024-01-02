import fs from "fs";
import path from "path";
import axios from "axios";
const translationsFolders = require("../../main/helpers/translationsFolders.json");

export default async function checkTranslationUpToDate(localization, lang) {
  const folder = translationsFolders[lang].folder;
  const link = translationsFolders[lang].link;

  const localGlobalIniPath = path.join(localization, "data", "Localization", folder, "global.ini");

  const localGlobalIni = await fs.readFileSync(localGlobalIniPath, "utf8");
  const hostedGlobalIniResponse = await axios.get(link);
  const hostedGlobalIni = hostedGlobalIniResponse.data;

  return localGlobalIni === "\ufeff"+hostedGlobalIni;
} 