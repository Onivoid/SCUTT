import { ipcMain } from "electron";
import getDisks from "../helpers/getDisks";
import scanLocation from "../helpers/scanLocation";
import checkTranslationStatus from "../helpers/check_translationStatus";

export async function systemEvents() {
  ipcMain.handle('get-disks', async () => {
    return getDisks();
  });
  ipcMain.handle('scan-location', async (event, {disk, version}: {disk: string, version: string}) => {
    return scanLocation(version, disk);
  });
  ipcMain.handle('check-translation-status', async (event, {localisation, lang}: {localisation: string, lang: string}) => {
    return checkTranslationStatus(localisation, lang).then((res) => {
      return res;
    });
  });
}