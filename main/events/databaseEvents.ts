import { ipcMain, dialog } from "electron";
import { updateUserPreferences, getUserPreferences, updateUserUiPreferences, resetDB } from "../database/functions";
import UserPreferences from '../database/class/UserPreferences';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import sqlite3 from 'sqlite3';

export async function databaseEvents() {
  ipcMain.on('registerPath', async (event, {gamePath, version}: {gamePath: string, version: string}) => {
    getUserPreferences(async (err, row) => {
      if (!err && row){
        const data = new UserPreferences(
          1,
          version === 'LIVE' ? gamePath: row.GamePathLive,
          version === 'PTU' ? gamePath: row.GamePathPtu,
          version === 'EPTU' ? gamePath: row.GamePathEptu,
          version === 'TECH-PREVIEW' ? gamePath: row.GamePathTechPreview,
          new Date(),
          row.UiPreferences,
        );

        console.log(data);
      
        await updateUserPreferences(data);
      }
    });
  });
  
  ipcMain.handle('get-user-preferences', async () => {
    return new Promise((resolve, reject) => {
      getUserPreferences((err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  });

  ipcMain.handle('update-user-ui-preferences', async (event, uiPreferences: Record<string, any>) => {
    await updateUserUiPreferences(uiPreferences);
  });

  ipcMain.handle('export-database', async () => {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'database.db');

    const { filePath } = await dialog.showSaveDialog({
      title: 'Exporter la Base de donnée',
      defaultPath: dbPath,
      filters: [{ name: 'SQL', extensions: ['db'] }],
    });
  
    if (!filePath) {
      return;
    }

    await fs.copyFile(dbPath, filePath, (err) => { err ? console.error(err) : console.log('Database exported')});
  
    return filePath;
  });

  ipcMain.handle('export-database-json', async () => {
    const userDataPath = app.getPath('userData');
    const dbPath = path.join(userDataPath, 'database.db');
  
    const db = new sqlite3.Database(dbPath);
    let data = {};
  
    const table = 'UserPreferences';
  
    data[table] = await new Promise((resolve, reject) => {
      db.all(`SELECT * FROM ${table}`, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  
    const { filePath } = await dialog.showSaveDialog({
      title: 'Exporter la Base de donnée',
      defaultPath: dbPath,
      filters: [{ name: 'JSON', extensions: ['json'] }],
    });
  
    if (!filePath) {
      return;
    }
  
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Database exported');
      }
    });
  
    return filePath;
  });
  
  ipcMain.handle('resetDB', async (event) => {
    try {
      resetDB();
      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la réinitialisation de la base de données :', error);
      return { success: false, error: error.message };
    }
  });
}