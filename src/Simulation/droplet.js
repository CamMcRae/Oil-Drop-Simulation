const constants = require('./constants.json');

class Droplet {
  constructor(_r, _c) {
    this.radius = _r; // m
    this.density = constants.densityOil; // kg/m^3
    this.dragCoefficient = constants.dragCoefficientOil;
    this.mass = 4 / 3 * Math.PI * Math.pow(this.radius, 3) * this.density; //kg
    this.charge = _c; // C
    this.pos = 0; // m
    this.vel = 0; // m/s
    this.acc = 0; // m/s^2
    this.trialStart = null;
    this.trialEnd = null;
  }

  update(simulation, time) {
    let Fg = this.mass * simulation.gField;
    let Fe = this.charge * Math.abs(simulation.eField.magnitude);
    // this should be terminal velocity, not regular velocity
    let area = Math.pi * this.radius * this.radius;
    let vSq = this.velocity * this.velocity;
    let Fd = this.dragCoefficient * this.density * area * 0.5 * vSq;

    let Fnet = Fe + Fd - Fg

    this.acc = Fnet / this.mass
    this.vel += this.acc;
    this.pos += this.vel * time.deltaTime / 1000;
    this.show();
  }

  show() {

  }
}

module.exports = Droplet;