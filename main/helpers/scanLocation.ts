import { glob } from 'glob';
import logger from '../logs/logger';

export default async function ScanLocation(version: string, drive: string){
  const searchPattern = `/**/StarCitizen.exe`;

  try {
    const result = await glob(`${drive}\\${searchPattern}`, { nodir: true, root: `${drive}\\` });

    const executablePath = result.find((path) => path.includes(version));

    if (executablePath === undefined) {
      return {
        gamePath: 'Not Found',
      };
    } else {
      const regex = /^(.*?\\StarCitizen).*/;
      const gamePath = executablePath.match(regex);
      if (gamePath && gamePath[1]) {
        logger.info(`Trouvé : ${gamePath[1].replace("\\StarCitizen", '')}`);
        return {
          gamePath: gamePath[1].replace("\\StarCitizen", ''),
        };
      } else {
        throw new Error('Failed to match game path');
      }
    }
  } catch (error) {
    logger.error(`Failed to scan location: ${error}`);
    throw error;
  }
}