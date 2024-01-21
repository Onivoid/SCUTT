import path from 'path'
import { BrowserWindow, app, ipcMain, shell } from 'electron';
import serve from 'electron-serve'
import { createWindow } from '../helpers'
import logger from '../logs/logger';

const isProd = process.env.NODE_ENV === 'production'

if (isProd) {
  serve({ directory: 'app' })
} else {
  app.setPath('userData', `${app.getPath('userData')} (development)`)
}

const { createDB } = require('../database/functions');

async function createDBWithRetry(retryCount = 0) {
  const maxRetries = 5;
  const delayBetweenRetriesMs = 500;

  try {
    await createDB();
  } catch (error) {
    if (retryCount < maxRetries) {
      logger.error(`Failed to create DB, attempt ${retryCount + 1} of ${maxRetries}. Retrying in ${delayBetweenRetriesMs / 1000} seconds...`);
      await new Promise(resolve => setTimeout(resolve, delayBetweenRetriesMs));
      await createDBWithRetry(retryCount + 1);
    } else {
      logger.error(`Failed to create DB after ${maxRetries} attempts.`, error);
      throw error;
    }
  }
}

export async function setupWindowEvents(){
  
  await createDBWithRetry();

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
  }

  app.on('window-all-closed', () => {
    app.quit()
  })
  
  ipcMain.on('normal-size', async (event, arg) => {
    let win = BrowserWindow.getFocusedWindow();
    if (!win) {
      win = BrowserWindow.getAllWindows()[0];
    }
    if (!win.isFocused()){
      win.focus();
    }
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