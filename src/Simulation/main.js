const sync = require('framesync');
const constants = require('./constants.json');
const sim = require('./simulation.js');
const Mousetrap = require('mousetrap');


module.exports.run = () => {

  let simulation = new sim();

  // maybe get a list of all trials from a json stored publically

  Mousetrap.bind(["space"], () => {
    // simulation.test();
    simulation.toggleSim();
  });
  let t;
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