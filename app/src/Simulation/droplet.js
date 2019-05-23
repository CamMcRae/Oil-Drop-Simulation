const constants = require('./constants.json');

class Droplet {
  constructor(_s, _r, _c) {
    this.simulation = _s;
    this.radius = _r || (Math.floor(Math.random() * 5) + 5) * 1e-7; // m
    this.density = constants.densityOil; // kg/m^3
    this.dragCoefficient = constants.dragCoefficientSphere;
    this.volume = 4 / 3 * Math.PI * Math.pow(this.radius, 3); // m^3
    this.mass = this.volume * this.density; // kg
    this.charge = _c || (Math.floor(Math.random() * 10) + 1) * constants.fundamentalCharge * (Math.random() > 0.5 ? 1 : -1); // C, 1 - 10;
    this.area = Math.PI * this.radius * this.radius; // m^2

    this.pos = 0; // m
    this.vel = 0; // m/s
    this.acc = 0; // m/s^2

    this.dragConst = this.dragCoefficient * this.density * this.area * 0.5;

    this.newConstants(this.simulation.eField);
  }

  // update loop runs every animation frame
  update(time) {
    let Fd = Math.pow(this.vel, 2) * this.dragConst * -Math.sign(this.vel);

    let Fnet = this.Fe - this.Fg + Fd;

    this.acc = Fnet / this.mass;
    this.vel += this.acc * (time.deltaTime / 1000);
    let vel = Math.min(Math.max(this.vel, -Math.abs(this.vt)), Math.abs(this.vt));
    this.vel = vel;

    this.pos += this.vel * (time.deltaTime / 1000);
    //
    // if (!isNaN(Fd)) {
    //   console.log("//////////////////////");
    //   console.log("VT: " + this.vt);
    //   console.log("Drag: " + Fd);
    //   console.log("Acc: " + this.acc);
    //   console.log("Vel: " + this.vel);
    //   console.log("Pos: " + this.pos);
    // }
  }

  // calculates new constants for the droplet so it doesn't do it every animation frame
  newConstants(_e) {
    this.Fe = this.charge * _e.vector;
    this.vt = 2 / 9 * (Math.pow(this.radius, 2) * (constants.densityAir - constants.densityOil) * (-constants.gravity + this.Fe / this.mass)) / constants.permeabilityAir;
    this.Fg = this.mass * this.simulation.gField;
  }
}

module.exports = Droplet;