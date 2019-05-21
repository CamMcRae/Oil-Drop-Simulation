const {
  app,
  BrowserWindow,
  globalShortcut,
  ipcMain,
  dialog
} = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
require('electron-reload')(__dirname);

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 800,
    minHeight: 600,
    icon: __dirname + "/assets/icon.png",
    webPreferences: {
      nodeIntegration: true
    },
    backgroundColor: '#fff',
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
  // globalShortcut.register('CommandOrControl+W', () => {
  //   app.quit();
  // })
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

// events that deal with the window
ipcMain.on('app-message', (event, arg) => {
  switch (arg) {
    case "close-app":
      app.quit();
      break;
    case "reload-app":
      app.relaunch();
      app.exit();
      break;
    case "minimize-app":
      BrowserWindow.getFocusedWindow().minimize()
      break;
    case "maximize-app":
      let w = BrowserWindow.getFocusedWindow()
      if (w.isMaximized()) {
        w.unmaximize()
      } else {
        w.maximize()
      }
      break;
  }
});

// attempts to save a file
ipcMain.on('file-output', (event, arg) => {
  console.log("DSAD")
  dialog.showSaveDialog({
    defaultPath: '~/millikanData.csv',
    filters: [{
      name: 'CSV files',
      extensions: ['csv']
    }, {
      name: 'All Files',
      extensions: ['*']
    }]
  }, (filename, err) => {
    if (filename == undefined) return
    if (err) {
      dialog.showMessageBox({
        type: "error",
        title: "An Unknown Error has occured.",
        message: err
      });
      event.reply('file-save-status', 'error')
    }

    fs.writeFile(filename, arg, (err) => {
      if (err) {
        event.reply('file-save-status', 'error')
        dialog.showMessageBox({
          type: "error",
          title: "There was an error saving the file.",
          message: err
        });
      } else {
        event.reply('file-save-status', 'success')
      }
    });
  });
});