import fs from 'fs';
import path from 'path';
import axios from 'axios';

export default async function checkTranslationStatus(localisation: string, lang: string) {
  const translationDir = await axios.get("https://scutt.onivoid.fr/api/translations/folders").then((res) => {
    return res.data[lang].folder;
  });
  const userCfgPath = path.join(localisation, 'user.cfg');
  const LocalizationDir = path.join(localisation, 'data', 'Localization', translationDir);
  const globalIniPath = path.join(LocalizationDir, 'global.ini');

  try {
    await fs.promises.access(userCfgPath);
    await fs.promises.access(LocalizationDir);
    await fs.promises.access(globalIniPath);

    return {
      response: true,
    };
  } catch {
    return {
      response: false,
    };
  }
}