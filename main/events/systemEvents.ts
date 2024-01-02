import { ipcMain } from "electron";
import getDisks from "../helpers/getDisks";
import scanLocation from "../helpers/scanLocation";
import checkTranslationStatus from "../helpers/check_translationStatus";
import uninstallTranslation from "../helpers/uninstall_translation";
import installTranslation from "../helpers/install_translation";
import checkTranslationUpdate from "../helpers/check_translationUpdate";

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
  ipcMain.handle('uninstall-translation', async (event, {localisation}: {localisation: string, lang: string}) => {
    return uninstallTranslation(localisation).then((res) => {
      return res;
    });
  });
  ipcMain.handle('install-translation', async (event, {localisation, lang}: {localisation: string, lang: string}) => {
    return installTranslation(localisation, lang).then((res) => {
      return res;
    });
  });
  ipcMain.handle('check-translation-update', async (event, {localisation, lang}: {localisation: string, lang: string}) => {
    return checkTranslationUpdate(localisation, lang).then((res) => {
      return res;
    });
  });
}