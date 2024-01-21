import fs from "fs";
import path from "path";
import logger from '../logs/logger';

export default async function uninstallTranslation(localization) {
  const LocalizationDir = path.join(localization, "data", "Localization");

  try {
    if (fs.existsSync(LocalizationDir)) {
      await fs.promises.rmdir(LocalizationDir, { recursive: true });
    }

    const userCfgPath = path.join(localization, "user.cfg");

    if (fs.existsSync(userCfgPath)) {
      await fs.promises.unlink(userCfgPath);
    }
  } catch (error) {
    logger.error(`Failed to uninstall translation: ${error}`);
    throw error;
  }
}