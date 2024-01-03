import { ipcMain, shell } from 'electron';

export async function socialEvents() {
  ipcMain.on('donate', async () => {
    return shell.openExternal('https://www.paypal.com/donate/?hosted_button_id=39UVHJRAQRQUJ');
  });
  ipcMain.on('joinTechnicalDiscord', async () => {
    return shell.openExternal('https://discord.gg/aUEEdMdS6j');
  });
}