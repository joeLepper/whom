import { app, BrowserWindow, ipcMain } from 'electron'
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer'
import { enableLiveReload } from 'electron-compile'
import { readdir, readFile, writeFile } from 'fs'
import { join, basename } from 'path'

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const isDevMode = process.execPath.match(/[\\/]electron/)

if (isDevMode) enableLiveReload({ strategy: 'react-hmr' })

const createWindow = async () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: true,
  })

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`)

  // Open the DevTools.
  if (isDevMode) {
    await installExtension(REACT_DEVELOPER_TOOLS)
    // mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('people--load', (event) => {
  readdir(`${__dirname}/people`, (err, people) => {
    const names = people.map((person) => {
      return basename(person).split('.json')[0]
    })
    event.sender.send('people--load:reply', names)
  })
})

ipcMain.on('person--load', (event, personId) => {
  console.log(personId)
  readFile(`${__dirname}/people/${personId}.json`, 'utf8', (err, person) => {
    console.log(JSON.stringify(person, null, 2))
    event.sender.send('person--load:reply', person)
  })
})
ipcMain.on('person--save', (event, personId, person) => {
  writeFile(`${__dirname}/people/${personId}.json`, person, 'utf8', (err) => {
    event.sender.send('person--save:reply', 'ok')
  })
})

ipcMain.on('person--create', (event, personId) => {
  readFile(`${__dirname}/person/template.json`, 'utf8', (err, person) => {
    writeFile(`${__dirname}/people/${personId}.json`, person, 'utf8', (err) => {
      event.sender.send('person--create:reply', person)
    })
  })
})
