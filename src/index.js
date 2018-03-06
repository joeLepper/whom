import { app, BrowserWindow } from 'electron'

require('electron-reload')(`${__dirname}/**/*.{css,js}`)

let mainWindow = null

const createWindow = async () => {
  mainWindow = new BrowserWindow({ fullscreen: true })
  mainWindow.setFullScreen(true)
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
