import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'path'

import { isDev } from './utils/is-dev'

let window: BrowserWindow | null = null

app.on('ready', () => {
  window = new BrowserWindow({
    height: 800,
    width: 1100,
    autoHideMenuBar: true,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  if (isDev) window.loadURL('http://localhost:3000')
  else {
    const uri = path.resolve('dist', 'view', 'index.html')
    window.loadFile(uri)
  }
})

app.on('window-all-closed', () => {
  app.quit()
})

ipcMain.on('minimize', () => {
  window?.minimize()
})
