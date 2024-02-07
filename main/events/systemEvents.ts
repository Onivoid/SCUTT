import { ipcMain } from "electron";
import getDisks from "../helpers/getDisks";
import scanLocation from "../helpers/scanLocation";
import checkTranslationStatus from "../helpers/check_translationStatus";
import uninstallTranslation from "../helpers/uninstall_translation";
import installTranslation from "../helpers/install_translation";
import checkTranslationUpdate from "../helpers/check_translationUpdate";
import { updateUserUiPreferences, getUserPreferences } from "../database/functions";
import { exec } from "child_process";
import { app } from 'electron';

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
  ipcMain.on('last-visited', async (event, {page}: {page: string}) => {
    getUserPreferences(async (err, row) => {
      if (!err && row){
          let UiPreferences = typeof row.UiPreferences === 'string' ? JSON.parse(row.UiPreferences) : row.UiPreferences;
          UiPreferences["LastVisitedPage"] = page;
          updateUserUiPreferences(UiPreferences);
      }
    });
  });
  ipcMain.on('last-gameVersion', async (event, {gameVersion}: {gameVersion: string}) => {
    getUserPreferences(async (err, row) => {
      if (!err && row){
          let UiPreferences = typeof row.UiPreferences === 'string' ? JSON.parse(row.UiPreferences) : row.UiPreferences;
          UiPreferences["LastGameVersion"] = gameVersion;
          updateUserUiPreferences(UiPreferences);
      }
    });
  });
  ipcMain.handle('is-elevated', async (event) => {
    return new Promise((resolve, reject) => {
      exec('net session', (err, stdout, stderr) => {
        if (err) {
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  });
}