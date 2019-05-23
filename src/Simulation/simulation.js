const constants = require('./constants.json');
const Timer = require('./time.js')
const Droplet = require('./droplet.js');
const Trial = require('./trial.js');
const renderer = require('../renderer-main.js');

class Simulation {
  constructor() {
    this.gField = constants.gravity;
    this.eField = {
      enabled: true,
      reverse: false,
      voltage: 0,
      magnitude: 0,
      vector: 0
    };
    this.separation = constants.defaultSeparation;
    this.pAir = constants.permeabilityAir;
    this.time = new Timer();
    this.spawnDrop();

    this.trial = {
      start: {
        time: null,
        pos: null
      },
      end: {
        time: null,
        pos: null
      },
    }
  }

  // main simulation update loop
  update(time) {
    this.time.update(time);
    if (this.droplet) {
      this.droplet.update(this.time);
      // if droplet is off the screen
      // if (this.droplet.pos > 0 || this.droplet.pos < -100) {
      //   this.droplet = null;
      // }
    }
    renderer.updateTime(this.time);
  }

  // creates a new droplet
  spawnDrop() {
    this.droplet = new Droplet(this, 8.069e-7, 6.31e-19);
    this.time.reset();
  }

  // toggle the simulation with spacebar
  toggleSim(_b) {
    if (_b) { // start trial
      this.trial.start.pos = this.droplet.pos;
      this.time.reset();
      this.time.start();
    } else { // end trial
      this.time.stop();
      this.trial.end.pos = this.droplet.pos;
      let distance = this.trial.end.pos - this.trial.start.pos
      return new Trial(this.droplet, this.eField.magnitude, this.time.getTotal() / 1000, distance);
    }
  }

  // updates the electric field
  updateEfield(_d) {
    if (_d) {
      this.eField = {
        enabled: _d.enabled,
        reverse: _d.reverse,
        voltage: _d.votage,
        magnitude: _d.voltage / this.separation
      };
    } else {
      this.eField.magnitude = this.voltage / this.separation
    }
    this.eField.vector = this.eField.magnitude * (this.eField.reverse ? -1 : 1) * (this.eField.enabled ? 1 : 0);
    this.droplet.newConstants(this.eField);
  }
}

module.exports = Simulation;