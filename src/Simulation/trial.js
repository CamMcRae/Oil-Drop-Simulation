class Trial {
  constructor(droplet, _f, _t, _d) {
    this.charge = droplet.charge;
    this.mass = droplet.mass;
    this.field = _f;
    this.time = _t;
    this.distance = _d;
    // append self to a json object
  }

  formatRow(_n) {
    return `${_n},${this.time},${this.distance}`
  }
}

module.exports = Trial;