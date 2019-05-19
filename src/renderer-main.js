const {
  ipcRenderer
} = require('electron');
const Mousetrap = require('mousetrap');
const $ = require('jquery');
const constants = require('./simulation/constants.json');
const math = require('mathjs');

let sim = require("./Simulation/main.js");
sim.run();

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
  for (let i = 0; i < 10; i++) {
    addTrial(i);
  }
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
function addTrial(i) {
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
$('.slider').on('mouseenter', () => {
  $('.right-slide-pane').addClass('no-grow');
  $('.slider-content').addClass('blur');
});

$('.slider').on('mouseleave', () => {
  $('.right-slide-pane').removeClass('no-grow');
  $('.slider-content').removeClass('blur');
});

// $('.slider-wrapper').on('click', (e) => {
//   let w = e.currentTarget.offsetWidth;
//   let p = (e.originalEvent.pageX - e.currentTarget.offsetLeft).clamp(0, w);
//   console.log("PERCENT: " + p / w * 100);
//   let slider;
//   if (p <= w / 2) {
//     slider = map(p, 0, w / 2, 1, 500);
//   } else {
//     slider = map(p, w / 2, w, 500, 1000);
//   }
//   setSlider(slider);
//   updateSpeed(slider / 10);
// });

$('input.slider').change((e, i) => {
  let s = $(e.target).val();
  updateSpeed(getRealSliderValue(s));
});

$('.sim-speed-wrapper.slow .sim-speed-content').on('click', () => {
  let s = 1;
  setSlider(getSliderLogFromValue(s), s);
});

$('.sim-speed-wrapper.medium .sim-speed-content').on('click', () => {
  let s = 10;
  setSlider(getSliderLogFromValue(s), s);
});

$('.sim-speed-wrapper.fast .sim-speed-content').on('click', () => {
  let s = 100;
  setSlider(getSliderLogFromValue(s), s);
});

// interprets the value the slider is set to
function getRealSliderValue(_v) {
  if (!_v) {
    _v = $('input.slider')
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
  $('input.slider').val(_v);
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

// $(".right-slide-toggle-wrapper").on('hover', () => {
//   $(".right-slide-pane").addClass('bump');
//   console.log("FDS");
//   // $(".right-slide-pane").removeClass('bump');
// });

// runs every update loop of the simulation

let p = 0;
module.exports.updateTime = (_t) => {
  p++
  if (p % 3 == 0) {
    let t = formatStopwatchText(_t.total);
    $(".stopwatch-display .display-text").text(t);
  }
}

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

$('.stopwatch-toggle').on('click', (_e) => {
  let e = $(_e.target);
  sim.toggleTime();
  if (e.hasClass('stop')) {
    e.removeClass('stop');
  } else {
    e.addClass('stop');
  }
});

$('.stopwatch-reset').on('click', (_e) => {
  $('.stopwatch-reset-wrapper').addClass('spin');
  sim.resetTime();
  $('.stopwatch-reset-wrapper').on('animationend', (t) => {
    $('.stopwatch-reset-wrapper').removeClass('spin');
  });
});