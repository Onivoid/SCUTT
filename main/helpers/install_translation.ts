import fs from 'fs';
import path from 'path';
import axios from 'axios';
import translationsFolders from '../../main/helpers/translationsFolders.json';
import logger from '../logs/logger';

export default async function installTranslation(localization: string, lang: string) {
  const userCfgPath = path.join(localization, "user.cfg");
  const link = translationsFolders[lang].link;
  const folder = translationsFolders[lang].folder;

  try {
    if (!fs.existsSync(userCfgPath)) {
      await fs.promises.writeFile(
        userCfgPath,
        `g_language = ${folder}\ng_languageAudio = english`,
        { encoding: "utf8" }
      );
    }

    const localizationDir = path.join(localization, "data", "Localization", folder);
    if (!fs.existsSync(localizationDir)) {
      await fs.promises.mkdir(localizationDir, { recursive: true });
    }

    const outputPath = path.join(localizationDir, "global.ini");

    const response = await axios.get(link);

    await fs.promises.writeFile(outputPath, "\ufeff"+response.data);

    return true;
  } catch (error) {
    logger.error(`Failed to install translation for language ${lang}`, error);
    throw error;
  }
}