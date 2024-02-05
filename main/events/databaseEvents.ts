import { ipcMain } from "electron";
import { updateUserPreferences, getUserPreferences, updateUserUiPreferences } from "../database/functions";
import UserPreferences from '../database/class/UserPreferences';

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
}