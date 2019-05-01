class simulation_trial_exportable {
  constructor(_c, _m, _f, _t, _d) {
    this.charge = _c;
    this.mass = _m;
    this.field = _f;
    this.time = _t;
    this.distance = _d;
  }

  formatRow(_n) {
    return `${_n},${this.time},${this.distance}`
  }
}