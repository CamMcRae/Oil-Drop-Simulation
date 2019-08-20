const {
  ipcRenderer
} = require('electron');
const Mousetrap = require('mousetrap');
window.$ = window.jQuery = require('jquery');
const constants = require('./Simulation/constants.json');
const math = require('mathjs');

let canvas;
let ctx;

let sim = require("./Simulation/main.js");
sim.run();

// Mousetrap is a package that manages keyboard event listeners
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
$(".exit").on('click', () => {
  sendIPC('app-message', 'close-app');
});

$(".minimize").on('click', () => {
  sendIPC('app-message', 'minimize-app');
});

$(".maximize").on('click', () => {
  sendIPC('app-message', 'maximize-app');
});

$('.export-button-wrapper>.export-button').on('click', () => {
  let text = sim.getExportable();
  sendIPC('file-output', text);
});

// wrapper function to send messages to main application class
function sendIPC(callID, arg) {
  ipcRenderer.send(callID, arg)
}

// when the document has loaded, initialize elements and their content
$(document).ready(() => {
  $('span.plate-input-wrapper.dynamic').text(constants.defaultSeparation);
  $('#gConst.list-element .list-body')[0].innerHTML = constants.gravity;
  $('#pConst-oil.list-element .list-body')[0].innerHTML = constants.densityOil;
  $('#pConst-air.list-element .list-body')[0].innerHTML = constants.densityAir;
  $('#nConst.list-element .list-body')[0].innerHTML = constants.permeabilityAirSci.str + `<sup>${constants.permeabilityAirSci.exp}</sup>`;
  canvas = document.getElementById("canvas");
  ctx = setupCanvas(canvas);
  // prevents arrow keys from acting on their own
  window.addEventListener('keydown', (e) => {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  }, false);
});

// event listener for right toggle
$('.right-slide-toggle').on('click', () => {
  $('.right-slide-pane').toggleClass('expand');
});

// click listener for removing a trial
$(document).on('click', '.remove-trial', (_e) => {
  let e = $(_e.target).parents('.trial-entry');
  sim.removeTrial(e.find('.number').text() - 1);
  e.addClass('slide-remove');
  updateTrialList();
  $(e).on('animationend', (t) => {
    e.remove();
  });
});

// updates numbering of trials
function updateTrialList() {
  let l = $('.trial-entries').children(":not(.defaultConstructor,.slide-remove)");
  for (let i = 0; i < l.length; i++) {
    let t = $(l[i]).find(".number");
    t.text(i + 1);
  }
}

// stops right pane from showing when the slider is interacted with
$('.slider').on('mouseenter', (_e) => {
  $('.right-slide-pane').addClass('no-grow');
  $(_e.target).addClass('blur');
});

$('.slider').on('mouseleave', (_e) => {
  $('.right-slide-pane').removeClass('no-grow');
  $(_e.target).removeClass('blur');
});

$('input.slider#time-step').on('input', (e, i) => {
  let s = $(e.target).val();
  updateSpeed(getRealSliderValue(s));
});

$('.time-slider-content .slider-label-wrapper.left .slider-label-content').on('click', () => {
  let s = 1;
  setSlider(getSliderLogFromValue(s), s);
});

$('.time-slider-content .slider-label-wrapper.center .slider-label-content').on('click', () => {
  let s = 10;
  setSlider(getSliderLogFromValue(s), s);
});

$('.time-slider-content .slider-label-wrapper.right .slider-label-content').on('click', () => {
  let s = 100;
  setSlider(getSliderLogFromValue(s), s);
});

// interprets the value the slider is set to
function getRealSliderValue(_v) {
  if (!_v) {
    _v = $('input.slider#time-step')
  }
  if (_v <= 500) {
    return map(_v, 1, 500, 1, 10);
  } else {
    return map(_v, 500, 1000, 10, 100);
  }
}

// returns the logarithmic value to set the slider position
function getSliderLogFromValue(_v) {
  return Math.log10(_v) * 500;
}

// sets the slider to a value
function setSlider(_v, _s) {
  $('input.slider#time-step').val(_v);
  let s = _s || getRealSliderValue();
  updateSpeed(s);
}

// updates the simulation speed with non logarithmic #'s
function updateSpeed(_v) {
  let v = Math.round(_v);
  sim.setSpeed(v);
}

// maps a range onto another range
function map(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

// runs every update loop of the simulation
let p = 0;
module.exports.updateTime = (_t, _f) => {
  p++
  if (_f || p % 3 == 0) {
    let t = formatStopwatchText(_t.total);
    setTime(t);
  }
}

// sets the stopwatch
function setTime(_t) {
  $(".stopwatch-display .display-text").text(_t);
}

// formats a date into a string to be displayed
function formatStopwatchText(_t) {
  let num = Math.round(_t / 10) / 100;
  let t = num.toString();
  let i = t.indexOf(".")
  let s;
  if (i != -1) {
    s = t.substring(i + 1);
    if (s.length == 1) t += "0";
  } else {
    t += ".00"
  }
  return t
}

$('.stopwatch-toggle').on('click', () => {
  toggleTime();
});

// toggles the main timer
function toggleTime(_b) {
  let e = $('.stopwatch-toggle');
  if (typeof _b != 'undefined') {
    if (!_b) {
      e.removeClass('stop');
    } else {
      e.addClass('stop');
    }
  } else {
    e.toggleClass('stop')
  }
}

$('.stopwatch-reset').on('click', () => {
  resetTime();
});

// resets the stopwatch
function resetTime() {
  $('.stopwatch-reset-wrapper').addClass('spin');
  sim.resetTime();
  $('.stopwatch-reset-wrapper').on('animationend', () => {
    $('.stopwatch-reset-wrapper').removeClass('spin');
  });
}

let on = false;
// toggles the simulation on and off
function toggleSim() {
  on = !on;
  toggleVoltageIcon(false);
  updateEfield();
  toggleTime(on);
  let t = sim.toggleSim(on);
  if (t) addTrial(t);
}

// adds a trial to the trials pane
function addTrial(_t) {
  let b = $('.trial-entries .trial-entry.defaultConstructor').clone();
  let temp = b.clone().removeClass('defaultConstructor');
  temp.find('.eField').text(_t.field.voltage);
  temp.find('.time').text(Math.round(_t.time * 1000) / 1000);
  temp.find('.distance').text(Math.round(_t.distance * 10000) / 100);
  $('.trial-entries').append(temp);
  updateTrialList();
}

// listens for the voltage slider to move and updates the simulation accordingly
$('input.slider#voltage').on('input', () => {
  handleVoltageInput();
});

// handles the input for changing voltage, slider and key events
function handleVoltageInput(_d) {
  let e = $('input.slider#voltage');
  if (typeof _d != 'undefined') {
    e.val(parseInt(e.val()) + _d);
  }
  let v = parseInt(e.val()) / 100
  updateVoltageDisplay(v);
  updateEfield(v);
}

// updates the voltage display
function updateVoltageDisplay(_v) {
  $('.voltage-display-text').text(_v);
}

// reads all elements for their content and sends it to the simulation
function updateEfield(_v) {
  let voltage = _v || parseFloat($('input.slider#voltage').val() / 100);
  let enabled = $('#voltage-toggle .button-icon').hasClass('toggle');
  let reverse = $('#polarity-toggle .button-icon').hasClass('toggle');
  let d = {
    enabled,
    reverse,
    voltage
  }
  sim.updateEfield(d);
}

// power supply event listeners
$("#voltage-toggle.button-wrapper").on('click', (_e) => {
  toggleVoltageIcon()
  updateEfield();
});

$("#polarity-toggle.button-wrapper").on('click', (_e) => {
  togglePolarityIcon();
  updateEfield();
});

// swaps voltage power icon
function toggleVoltageIcon(_f) {
  if (typeof _f !== 'undefined') {
    if (_f) {
      $('#voltage-toggle.button-wrapper').find('.button-icon').addClass('toggle');
    } else {
      $('#voltage-toggle.button-wrapper').find('.button-icon').removeClass('toggle');
    }
  } else {
    $('#voltage-toggle.button-wrapper').find('.button-icon').toggleClass('toggle');
  }
}

// swaps polarity icon
function togglePolarityIcon(_f) {
  if (typeof _f !== 'undefined') {
    if (_f) {
      $('#polarity-toggle.button-wrapper').find('.button-icon').addClass('toggle');
    } else {
      $('#polarity-toggle.button-wrapper').find('.button-icon').removeClass('toggle');
    }
  } else {
    $('#polarity-toggle.button-wrapper').find('.button-icon').toggleClass('toggle');
  }
}

// add droplet button event listener
$('#new-drop').click(() => {
  sim.newDrop();
});

// sets canvas up for screen
function setupCanvas(canvas) {
  let dpi = window.devicePixelRatio || 1;
  let border = canvas.getBoundingClientRect();
  canvas.width = border.width * dpi;
  canvas.height = border.height * dpi;
  let ctx = canvas.getContext('2d');
  ctx.scale(dpi, dpi);
  return ctx;
}

// canvas scale variable
const pxPerCm = 160;

// canvas animation loop
module.exports.drawLoop = (_s) => {
  if (!ctx) return;
  const width = canvas.width;
  const height = canvas.height;
  // draws background
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, width, height);

  ctx.save()
  ctx.translate(0, 30);

  // draws droplet
  if (_s.droplet) {
    ctx.fillStyle = 'black';
    let posPx = -_s.droplet.pos * pxPerCm * 100 + 5;
    ctx.fillRect(width / 2, posPx, 3, 3);
  }

  // draws parrallel plates
  ctx.fillStyle = '#000';
  ctx.fillRect(50, -1, width - 100, 2);
  ctx.fillStyle = '#000';
  ctx.fillRect(50, pxPerCm * 2.5, width - 100, 2);
  // top sign convention
  ctx.save();
  ctx.translate(width - 20, 0);
  ctx.fillRect(-8, -2, 14, 2);
  if (!_s.eField.reverse) ctx.fillRect(-2, -8, 2, 14);
  ctx.restore();
  // bottom sign convention
  ctx.save();
  ctx.translate(width - 20, pxPerCm * 2.5);
  ctx.fillRect(-8, -2, 14, 2);
  if (_s.eField.reverse) ctx.fillRect(-2, -8, 2, 14);
  ctx.restore();

  // draws red scale lines
  ctx.fillStyle = 'red';
  ctx.save();
  ctx.translate(width / 2 - 30, 0);
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.translate(0, i * pxPerCm);
    ctx.fillRect(0, 0, 40, 1);
    for (let j = 0; j < 10; j++) {
      ctx.translate(0, pxPerCm / 10);
      ctx.fillRect(0, 0, j == 4 ? 30 : 20, 1);
    }
    ctx.restore();
  }
  ctx.restore();
  // removes extra scale lines
  // ctx.fillStyle = '#fff';
  // ctx.fillRect(0, pxPerCm * 2.5 + 2, width - 30, 100);

  ctx.restore();
}