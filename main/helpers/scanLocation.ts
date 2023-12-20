const { glob } = require('glob');
import logger from '../logs/logger';

export default async function ScanLocation(version: string, drive: string){
  const searchPattern = `/**/StarCitizen.exe`;

  const result = await glob(`${drive}\\${searchPattern}`, { nodir: true, root: `${drive}\\` });
    

    const executablePath = result.find((path) => path.includes(version));

    if (executablePath === undefined) {
      return {
        gamePath: 'Not Found',
      };
    } else {
      const regex = /^(.*?\\StarCitizen).*/;
      const gamePath = executablePath.match(regex);
      logger.info(`Trouvé : ${gamePath[1].replace("\\StarCitizen", '')}`);
      return {
        gamePath: gamePath[1].replace("\\StarCitizen", ''),
      };
    }
}