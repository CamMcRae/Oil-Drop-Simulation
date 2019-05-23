class Trial {
  constructor(_n, droplet, _f, _t, _d) {
    this.num = _n;
    this.charge = droplet.charge;
    this.mass = droplet.mass;
    this.field = _f;
    this.time = _t;
    this.distance = _d;
    // append self to a json object
  }

  toString() {
    return `${t.field.voltage},${this.time},${this.distance}\n`
  }
}

module.exports = Trial;