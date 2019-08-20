const {
  ipcRenderer
} = require('electron');
const Mousetrap = require('mousetrap');
window.$ = window.jQuery = require('jquery');
const constants = require('./Simulation/constants.json');

let sim = require("./Simulation/main.js");
sim.run();

// Moustrap setup
Mousetrap.stopCallback = () => {
  return false;
}

Mousetrap.bind(["command+w", "ctrl+w"], () => {
  sendIPC('app-message', 'close-app');
});

Mousetrap.bind(["command+s", 'ctrl+s'], () => {
  sendIPC('file-output', sim.getExportable());
});

Mousetrap.bind(['space'], () => {
  toggleSim();
});

Mousetrap.bind(['r'], () => {
  resetTime();
});

Mousetrap.bind(['left'], () => {
  handleVoltageInput(-50);
});

Mousetrap.bind(['right'], () => {
  handleVoltageInput(50);
});

Mousetrap.bind(['ctrl+left', 'command+left'], () => {
  handleVoltageInput(-500);
});

Mousetrap.bind(['ctrl+right', 'command+left'], () => {
  handleVoltageInput(500);
});

// Application header event listeners
$(".exit").click(() => {
  sendIPC('app-message', 'close-app');
});

$(".minimize").click(() => {
  sendIPC('app-message', 'minimize-app');
});

$(".maximize").click(() => {
  sendIPC('app-message', 'maximize-app');
});

$('.export-button-wrapper>.export-button').click(() => {
  const text = sim.getExportable();
  sendIPC('file-output', text);
});

// wrapper function to send messages to main application class
function sendIPC(callID, arg) {
  ipcRenderer.send(callID, arg)
}

let canvas;
let ctx;

// sets canvas up for screen
setupCanvas = (canvas) => {
  let dpi = window.devicePixelRatio || 1;
  let border = canvas.getBoundingClientRect();
  canvas.width = border.width * dpi;
  canvas.height = border.height * dpi;
  let ctx = canvas.getContext('2d');
  ctx.scale(dpi, dpi);
  return ctx;
}

module.exports = {
  drawLoop = (_s) => {

  },
  updateState = (_s) => {
    $('#voltage-value').text();;
    $('#stopwatch-value').text();
  }
}

// event listener for right toggle
$('.right-slide-toggle').click(() => {
  $('.right-slide-pane').toggleClass('expand');
});

// add droplet button event listener
$('#new-drop').click(() => {
  sim.newDrop();
});

$('.stopwatch-reset').click(() => {
  resetTime();
});

resetTime = () => {
  $('.stopwatch-reset-wrapper').addClass('spin');
  sim.resetTime();
  $('.stopwatch-reset-wrapper').on('animationend', () => {
    $('.stopwatch-reset-wrapper').removeClass('spin');
  });
}