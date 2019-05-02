const {
  ipcRenderer
} = require('electron');
const Mousetrap = require('mousetrap');
const $ = require('jquery');

require("./Simulation/main.js").run();

Mousetrap.bind(["command+w", "ctrl+w"], () => {
  sendIPC('app-message', 'close-app')
})

Mousetrap.bind(["command+r", "ctrl+r"], () => {
  sendIPC('app-message', 'reload-app')
})

Mousetrap.bind(["command+s", 'ctrl+s'], () => {
  sendIPC('file-output', '00, 01, 02\n10,11,12')
});

$(".exit").on('click', () => {
  sendIPC('app-message', 'close-app')
})

$(".minimize").on('click', () => {
  sendIPC('app-message', 'minimize-app')
})

$(".maximize").on('click', () => {
  sendIPC('app-message', 'maximize-app')
})

function sendIPC(callID, arg) {
  ipcRenderer.send(callID, arg)
}

// when a save attempt has been completed the status is returned to update html
ipcRenderer.on('file-save-status', (event, arg) => {
  // send to simulation
});