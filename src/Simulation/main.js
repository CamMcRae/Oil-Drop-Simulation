const sync = require('framesync');
const constants = require('./constants.json');
const sim = require('./simulation.js');

module.exports.run = () => {

  let simulation = new sim();

  sync.default.update(({
    delta,
    timestamp
  }) => {
    const deltaTime = delta;
    simulation.update();
  });
};