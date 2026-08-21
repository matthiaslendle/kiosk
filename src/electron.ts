import { app, BrowserWindow } from 'electron';
import path from 'path';
import started from 'electron-squirrel-startup';

let mainWindow: BrowserWindow | null = null;

if (started) {
  app.quit();
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true
    }
  });

  mainWindow.webContents.openDevTools();

  mainWindow.setMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'public', 'browser', 'index.html'));

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
