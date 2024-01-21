import fs from 'fs';
import path from 'path';
import translationsFolders from '../../main/helpers/translationsFolders.json';

export default async function checkTranslationStatus(localisation: string, lang: string) {
  const userCfgPath = path.join(localisation, 'user.cfg');
  const LocalizationDir = path.join(localisation, 'data', 'Localization', translationsFolders[lang].folder);
  const globalIniPath = path.join(LocalizationDir, 'global.ini');

  try {
    await fs.promises.access(userCfgPath);
    await fs.promises.access(LocalizationDir);
    await fs.promises.access(globalIniPath);

    return {
      enabled: translationsFolders[lang].enabled,
      response: true,
      link: translationsFolders[lang].link,
    };
  } catch {
    return {
      enabled: translationsFolders[lang].enabled,
      response: false,
      link: translationsFolders[lang].link,
    };
  }
}