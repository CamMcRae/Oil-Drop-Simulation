const sync = require('framesync');
const constants = require('./constants.json');
const sim = require('./simulation.js');
const Mousetrap = require('mousetrap');
const math = require('mathjs');
const renderer = require('../renderer-main.js');

let simulation;

// begins simulation
module.exports.run = () => {

  simulation = new sim();

  // main animation loop
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
      renderer.drawLoop(simulation);
    }
  }, true);
};

module.exports.getSeparation = () => {
  if (simulation) return simulation.separation;
}

module.exports.setSeparation = (_v) => {
  if (!simulation) return;
  simulation.separation = _v;
  simulation.updateEfield();
}

module.exports.changeSeparation = (step) => {
  if (!simulation) return;
  simulation.separation = math.round(math.add(simulation.separation, step), 3);
  simulation.updateEfield(_d);
}

module.exports.getExportable = () => {
  if (!simulation) return;
  return simulation.getExportable();
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

module.exports.toggleSim = (_b) => {
  if (!simulation) return;
  return simulation.toggleSim(_b);
}

module.exports.updateEfield = (_d) => {
  if (!simulation) return;
  simulation.updateEfield(_d);
}

module.exports.removeTrial = (_n) => {
  if (!simulation) return;
  simulation.removeTrial(_n);
}