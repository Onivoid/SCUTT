import { ipcMain } from "electron";
import getDisks from "../helpers/getDisks";
import scanLocation from "../helpers/scanLocation";

export async function systemEvents() {
  ipcMain.handle('get-disks', async () => {
    return getDisks();
  });
  ipcMain.handle('scan-location', async (event, {disk, version}: {disk: string, version: string}) => {
    return scanLocation(version, disk);
  });
}