const {
  app,
  BrowserWindow,
  Menu,
  globalShortcut
} = require('electron');
const path = require('path');
const url = require('url');
const Mousetrap = require('mousetrap');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + "/assets/icon.png",
    webPreferences: {
      nodeIntegration: true
    },
    frame: false
  })
  // removes a secondary menu at the top
  win.setMenu(null)

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/main.html'),
    protocol: 'file:',
    slashes: true
  }))

  // shows devtools
  win.webContents.openDevTools();

  // force closes on close
  win.on('closed', () => {
    win = null
  })

  // allows Ctrl+W to close window
  globalShortcut.register('CommandOrControl+W', () => {
    app.quit();
  })
  globalShortcut.register('CommandOrControl+R', () => {
    win.reload()
  })
}

app.on('ready', createWindow);

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// forces window closed on non Mac platforms
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
})