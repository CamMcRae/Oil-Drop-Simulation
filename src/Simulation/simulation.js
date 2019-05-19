const constants = require('./constants.json');
const Timer = require('./time.js')
const Droplet = require('./droplet.js');
const body = require('../renderer-main.js');

class Simulation {
  constructor() {
    this.gField = constants.gravity;
    this.eField = {
      enabled: false,
      reverse: false,
      magnitude: 0
    };
    this.separation = constants.defaultSeparation;
    this.pAir = constants.permeabilityAir;
    this.time = new Timer();
    this.spawnDrop();
  }

  update(time) {
    this.time.update(time);
    if (this.droplet) {
      this.droplet.update(this, time);
    }
    body.updateTime(this.time);
    this.show();
  }

  show() {

  }

  spawnDrop() {
    this.droplet = new Droplet();
    this.time.reset();
  }

  test() {
    this.time.getTotal();
  }

  toggleSim() {
    if (this.eField.enabled) { // disable field and let droplet fall
      this.time.reset()
      this.droplet.trialStart = this.droplet.pos;
    } else { // end trial
      this.droplet.trialEnd = this.droplet.pos;
      let distance = this.droplet.trialEnd - this.droplet.trialStart
      new Trial(this.droplet, this.eField.magnitude, this.time.getTotal() / 1000, distance);
    }
    this.eField.enabled = !this.eField.enabled;
  }
}

module.exports = Simulation;