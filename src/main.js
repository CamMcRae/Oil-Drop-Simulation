const {
  ipcRender
} = require('electron');
const Mousetrap = reqiure('mousetrap');


Mousetrap.bind(["command + w", "ctrl + w"], () => {
  ipcRenderer.sendSync('synchronous-message', 'close-app')
})