import fs from "fs";
import path from "path";

export default async function uninstallTranslation(localization) {
  const LocalizationDir = path.join(localization, "data", "Localization");

  if (fs.existsSync(LocalizationDir)) {
    await fs.rmdir(LocalizationDir, { recursive: true }, (err) => err);
  }

  const userCfgPath = path.join(localization, "user.cfg");

  if (fs.existsSync(userCfgPath)) {
    await fs.unlink(userCfgPath, (err) => err);
  }

  return;
}