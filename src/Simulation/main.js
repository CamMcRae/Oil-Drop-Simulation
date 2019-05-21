const sync = require('framesync');
const constants = require('./constants.json');
const sim = require('./simulation.js');
const Mousetrap = require('mousetrap');
const math = require('mathjs');
const renderer = require('../renderer-main.js');

let simulation;

module.exports.run = () => {

  simulation = new sim();

  sync.default.update(({
    delta,
    timestamp
  }) => {
    const time = {
      deltaTime: delta,
      time: timestamp
    }
    for (let i = 0; i < simulation.time.speed; i++) {
      simulation.update(time);
    }
  }, true);
};

module.exports.getSeparation = () => {
  if (simulation) return simulation.separation;
}

module.exports.setSeparation = (_v) => {
  if (simulation) simulation.separation = _v;
}

module.exports.changeSeparation = (step) => {
  if (!simulation) return;
  simulation.separation = math.round(math.add(simulation.separation, step), 3);
}

module.exports.getExportable = () => {
  if (!simulation) return;
  return ("");
}

module.exports.toggleTime = () => {
  if (!simulation) return;
  simulation.time.toggle();
  renderer.updateTime(simulation.time, true);
}

module.exports.resetTime = () => {
  if (!simulation) return;
  simulation.time.reset();
  renderer.updateTime(simulation.time, true);
}

module.exports.setSpeed = (_s) => {
  if (!simulation) return;
  simulation.time.speed = Math.floor(_s);
}

module.exports.toggleSim = () => {
  if (!simulation) return;
  return simulation.toggleSim();
}

module.exports.updateEfield = (_d) => {
  if (!simulation) return;
  simulation.updateEfield(_d);
}