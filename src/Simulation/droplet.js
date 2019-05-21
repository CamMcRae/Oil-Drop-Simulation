const constants = require('./constants.json');

class Droplet {
  constructor(_r, _c, _s) {
    this.simulation = _s;
    this.radius = _r; // m
    this.density = constants.densityOil; // kg/m^3
    this.dragCoefficient = constants.dragCoefficientSphere;
    this.volume = 4 / 3 * Math.PI * Math.pow(this.radius, 3); // m^3
    this.mass = this.volume * this.density; // kg
    this.charge = _c || Math.Ceil(Math.random() * 10) + 1; // C, 1 - 10;
    this.area = Math.PI * this.radius * this.radius; // m^2

    this.pos = 0; // m
    this.vel = 0; // m/s
    this.acc = 0; // m/s^2

    this.dragConst = this.dragCoefficient * this.density * this.area * 0.5;

    this.newConstants(this.simulation.eField);
  }

  update(time) {
    let Fd = Math.pow(this.vel, 2) * this.dragConst * -Math.sign(this.vel);

    let Fnet = this.Fe - this.Fg + Fd;

    this.acc = Fnet / this.mass;
    this.vel += this.acc * (time.deltaTime / 1000);
    this.vel = Math.sign(this.vel) * Math.min(this.vt, Math.abs(this.vel));

    this.pos += this.vel;

    // if (!isNaN(Fd)) {
    //   console.log("////////////////////////////////");
    //   console.log("Drag: " + Fd);
    //   console.log("Acc: " + this.acc);
    //   console.log("Vel: " + this.vel);
    //   console.log("Pos: " + this.pos);
    // }
    console.log(this.vel);
  }

  newConstants(_e) {
    this.Fe = this.charge * this.simulation.eField.magnitude * constants.fundamentalCharge;
    this.vt = Math.pow((2 * this.mass * (constants.gravity + this.Fe / this.mass)) / (this.density * this.area * this.dragCoefficient), 1 / 2);
    this.Fg = this.mass * this.simulation.gField;
    // console.log(this.vt);
  }
}

module.exports = Droplet;