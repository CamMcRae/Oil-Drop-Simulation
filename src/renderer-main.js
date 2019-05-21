const {
  ipcRenderer
} = require('electron');
const Mousetrap = require('mousetrap');
window.$ = window.jQuery = require('jquery');
const constants = require('./simulation/constants.json');
const math = require('mathjs');

let sim = require("./Simulation/main.js");
sim.run();

// Keyboard event listeners

Mousetrap.bind(["ctrl+l"], () => {
  $('.right-slide-pane').toggleClass('expand');
});

Mousetrap.bind(["command+w", "ctrl+w"], () => {
  sendIPC('app-message', 'close-app');
});

Mousetrap.bind(["command+r", "ctrl+r"], () => {
  sendIPC('app-message', 'reload-app');
});

Mousetrap.bind(["command+s", 'ctrl+s'], () => {
  sendIPC('file-output', '00, 01, 02\n10,11,12');
});

Mousetrap.bind(['space'], () => {
  toggleSim();
});

Mousetrap.bind(['r'], () => {
  resetTime();
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

// when a save attempt has been completed the status is returned to update html
ipcRenderer.on('file-save-status', (event, arg) => {
  // send to simulation
});

// when the document has loaded, initialize elements and their content
$(document).ready(() => {
  $('span.plate-input-wrapper.dynamic').text(constants.defaultSeparation);
  $('#gConst.list-element .list-body')[0].innerHTML = constants.gravity;
  $('#pConst.list-element .list-body')[0].innerHTML = constants.densityOil;
  $('#nConst.list-element .list-body')[0].innerHTML = constants.densityAir;
});

$('span.dynamic').on('click', (_e) => {
  let e = $(_e.target);
  $(e).addClass('editing');
  $(e).attr('contentEditable', true);
  $(e).focus();
});

$('span.dynamic').on('blur', (_e) => {
  let e = $(_e.target);
  $(e).removeClass('editing');
  $(e).attr('contentEditable', false);
  let c = $(e).text();


  let v = sim.getSeparation();
  if (isNaN(c) || c == "") {
    $(e).text(v);
  } else {
    c = math.round(parseFloat(c), 3);
    sim.setSeparation(c);
    $(e).text(c);
  }
});

$('span.dynamic').on('keypress', (e) => {
  if (e.which == 13) $('span.dynamic').trigger('blur');
})

$('.plate-input-selector-wrapper .arrow').on('click', (_e) => {
  let e = $(_e.target);
  if (e.hasClass('editing')) return;
  if (e.hasClass('right')) {
    // increase distance
    sim.changeSeparation(+0.001);
  } else {
    // decrease distance
    sim.changeSeparation(-0.001);
  }
  let v = sim.getSeparation();
  if (math.mod(v, 0.01) == 0) v = v.toString() + "0";
  $('span.dynamic.plate-input-wrapper').text(v);
});

$('.right-slide-toggle').on('click', () => {
  $('.right-slide-pane').toggleClass('expand');
});

// click listener for removing a trial
$(document).on('click', '.remove-trial', (_e) => {
  let e = $(_e.target).parents('.trial-entry');
  e.addClass('slide-remove');
  $(e).on('animationend', (t) => {
    e.remove();
    updateTrialList();
  });
});

// adds a trial to the trials list
function addTrialTest(i) {
  let b = $('.trial-entries .trial-entry.defaultConstructor').clone();
  $('.trial-entries').append(b.clone().removeClass('defaultConstructor'));
  updateTrialList();
}

// updates numbering of trials
function updateTrialList() {
  let l = $('.trial-entries').children(":not(.defaultConstructor)");
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

// stops a value from exceeding a range
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

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
function toggleTime() {
  let e = $('.stopwatch-toggle');
  sim.toggleTime();
  if (e.hasClass('stop')) {
    e.removeClass('stop');
  } else {
    e.addClass('stop');
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

// toggles the simulation on and off
function toggleSim() {
  toggleTime();
  let t = sim.toggleSim();
  if (t) addTrial(t);
}

// updates the position of the droplet
module.exports.updateDrop = (_d) => {
  if (!_d) return;
  // console.log(_d);
  // $('.oil-drop').css({
  //   'transform': 'translateY(' + _d.pos + ')'
  // });
};

// adds a trial to the trials pane
function addTrial(_t) {
  let b = $('.trial-entries .trial-entry.defaultConstructor').clone();
  let temp = b.clone().removeClass('defaultConstructor');
  temp.find('.eField').text(_t.field);
  temp.find('.time').text(Math.round(_t.time * 1000) / 1000);
  temp.find('.distance').text(_t.distance);
  $('.trial-entries').append(temp);
  updateTrialList();
}

// listens for the voltage slider to move and updates the simulation accordingly
$('input.slider#voltage').on('input', (e) => {
  updateEfield();
});

function updateEfield() {
  let voltage = parseInt($('input.slider#voltage').val());
  let enabled = true;
  let reverse = true
  let d = {
    enabled,
    reverse,
    voltage
  }
  sim.updateEfield(d);
}