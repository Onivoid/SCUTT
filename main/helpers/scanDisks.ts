import { exec } from 'child_process';
import logger from '../logs/logger';

export default async function scanDisks() {
  try {
    const drives = await new Promise((resolve, reject) => {
      exec('wmic logicaldisk get caption', (error, stdout, stderr) => {
        if (error) {
          logger.error(`Failed to execute command: ${error.message}`);
          reject(error);
        }
        if (stderr) {
          logger.error(`Command error: ${stderr}`);
          reject(stderr);
        }

        const driveList = stdout
          .split('\n')
          .slice(1, -1)
          .map(drive => drive.trim())
          .filter(drive => drive !== '');

        resolve(driveList);
      });
    });

    return {
      disks: drives,
    };
  } catch (error) {
    logger.error(`Failed to scan disks: ${error}`);
    return {
      disks: [],
    };
  }
}