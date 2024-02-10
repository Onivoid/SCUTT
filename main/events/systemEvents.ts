import { ipcMain } from "electron";
import getDisks from "../helpers/getDisks";
import scanLocation from "../helpers/scanLocation";
import checkTranslationStatus from "../helpers/check_translationStatus";
import uninstallTranslation from "../helpers/uninstall_translation";
import installTranslation from "../helpers/install_translation";
import checkTranslationUpdate from "../helpers/check_translationUpdate";
import { updateUserUiPreferences, getUserPreferences } from "../database/functions";
import { exec } from "child_process";
import axios from "axios";
import Translation from "../helpers/class/translation";

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
  ipcMain.handle('install-translation', async (event, {translation, localisation, lang}: {translation: Translation, localisation: string, lang: string}) => {
    return installTranslation(translation, localisation, lang).then((res) => {
      return res;
    });
  });
  ipcMain.handle('check-translation-update', async (event, {translation, localisation, lang}: {translation: Translation, localisation: string, lang: string}) => {
    return checkTranslationUpdate(translation, localisation, lang).then((res) => {
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
  ipcMain.on('choosed-language', async (event, {lang}: {lang: string}) => {
    getUserPreferences(async (err, row) => {
      if (!err && row){
          let UiPreferences = typeof row.UiPreferences === 'string' ? JSON.parse(row.UiPreferences) : row.UiPreferences;
          UiPreferences["choosedLanguage"] = lang;
          updateUserUiPreferences(UiPreferences);
      }
    });
  });
  ipcMain.on('choosed-translation', async (event, {translation}: {translation: Record<string, any>}) => {
    getUserPreferences(async (err, row) => {
      if (!err && row){
          let UiPreferences = typeof row.UiPreferences === 'string' ? JSON.parse(row.UiPreferences) : row.UiPreferences;
          UiPreferences["choosedTranslation"] = translation;
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
  ipcMain.handle('get-translations', async () => {
    return new Promise((resolve, reject) => {
      const data = axios.get('https://scutt.onivoid.fr/api/translations').then((res) => {
        if (res.status !== 200) {
          reject('Error');
        } else {
          resolve(res.data);
        }
      });
    });
  });
}