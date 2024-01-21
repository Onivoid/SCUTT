import fs from 'fs';
import path from 'path';
import axios from 'axios';
import translationsFolders from '../../main/helpers/translationsFolders.json';
import logger from '../logs/logger';

export default async function checkTranslationUpToDate(localization: string, lang: string) {
  const folder = translationsFolders[lang].folder;
  const link = translationsFolders[lang].link;

  const localGlobalIniPath = path.join(localization, 'data', 'Localization', folder, 'global.ini');

  try {
    const localGlobalIni = await fs.promises.readFile(localGlobalIniPath, 'utf8');
    const hostedGlobalIniResponse = await axios.get(link);
    const hostedGlobalIni = hostedGlobalIniResponse.data;

    return localGlobalIni === '\ufeff' + hostedGlobalIni;
  } catch (error) {
    logger.error(`Failed to check if translation is up to date for language ${lang}`, error);
    throw error;
  }
}