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