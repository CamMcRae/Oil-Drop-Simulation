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

// $(".right-slide-toggle-wrapper").on('hover', () => {
//   $(".right-slide-pane").addClass('bump');
//   console.log("FDS");
//   // $(".right-slide-pane").removeClass('bump');
// });