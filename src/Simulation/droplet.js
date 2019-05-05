const constants = require('./constants.json');

class Droplet {
  constructor(_r, _c) {
    this.radius = _r; // m
    this.density = constants.densityOil; // kg/m^3
    this.mass = 4 / 3 * Math.PI * Math.pow(this.radius, 3) * this.density;
    this.charge = _c;
    this.pos = [0, 0];
    this.vel = [0, 0];
    this.acc = [0, 0];
  }

  update() {
    this.fg = this.mass * simulation.gfs;
    this.fe = this.charge * Math.abs(simulation.efs);
    this.fd = 6 * Math.pi * this.radius * simulation.pAir * this.vel;

    this.acc[1] = this.fe + this.fd - this.fg
    this.acc[1] /= this.mass;
    this.vel[1] += this.acc;
    this.pos[1] += this.vel * simulation.time.deltaTime / 1000;
  }

  show() {

  }
}

module.exports = Droplet;