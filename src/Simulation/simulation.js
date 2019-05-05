const constants = require('./constants.json');
const Timer = require('./time.js')
const Droplet = require('./droplet.js');

class Simulation {
  constructor() {
    this.gfs = constants.gravity;
    this.efs = 0;
    this.pAir = constants.permeabilityAir;
    this.time = new Timer();

    this.drop = new Droplet();
  }

  update() {
    this.time.update();
    this.show();
  }

  show() {

  }
}

module.exports = Simulation;