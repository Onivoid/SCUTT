import path from 'path'
import { BrowserWindow, app, ipcMain } from 'electron';
import serve from 'electron-serve'
import { createWindow } from '../helpers'

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

const { createDB } = require('../database/functions');

export async function setupWindowEvents(){
  
  await createDB();

  const mainWindow = createWindow('main', {
    width: 300,
    height: 300,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  mainWindow.center();
  if (isProd) {
    await mainWindow.loadURL('app://./run')
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/run`)
    //mainWindow.webContents.openDevTools()
  }

  app.on('window-all-closed', () => {
    app.quit()
  })
  
  ipcMain.on('normal-size', async (event, arg) => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.setSize(1152, 648);
      win.setMinimumSize(1152, 648);  
      win.setResizable(true); 
      win.center();
    }
  });
  
  ipcMain.on('close-app', async () => {
    app.quit();
  });
};