const sync = require('framesync');
const constants = require('./constants.json');
const sim = require('./simulation.js');
const Mousetrap = require('mousetrap');
const math = require('mathjs');

let simulation;

module.exports.run = () => {

  simulation = new sim();

  // maybe get a list of all trials from a json stored publically

  Mousetrap.bind(["space"], () => {
    // simulation.test();
    // simulation.toggleSim();
  });

  sync.default.update(({
    delta,
    timestamp
  }) => {
    const time = {
      deltaTime: delta,
      time: timestamp
    }
    simulation.update(time);
  }, true);
};

module.exports.getSeparation = () => {
  if (simulation) return simulation.separation;
}

module.exports.setSeparation = (_v) => {
  if (simulation) simulation.separation = _v;
}

module.exports.changeSeparation = (step) => {
  if (simulation) {
    simulation.separation = math.round(math.add(simulation.separation, step), 3);
  }
}