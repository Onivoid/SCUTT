import fs from 'fs';
import path from 'path';
import axios from 'axios';
import logger from '../logs/logger';
import Translation from './class/translation';

export default async function checkTranslationUpToDate(translation: Translation, localization: string, lang: string) {

  const folder = await axios.get("https://scutt.onivoid.fr/api/translations/folders").then((res) => {
    return res.data[lang].folder;
  });


  try {
    const localGlobalIniPath = path.join(localization, 'data', 'Localization', folder, 'global.ini');
    const localGlobalIni = await fs.promises.readFile(localGlobalIniPath, 'utf8');
    const hostedGlobalIniResponse = await axios.get(translation.url);
    const hostedGlobalIni = hostedGlobalIniResponse.data;

    return localGlobalIni === '\ufeff' + hostedGlobalIni;
  } catch (error) {
    logger.error(`Failed to check if translation is up to date for language ${lang}`, error);
    throw error;
  }
}