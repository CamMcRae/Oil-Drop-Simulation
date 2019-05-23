class Timer {
  constructor(_s) {
    this.speed = _s || 1;
    this.reset();
    this.paused = true;
  }

  update(_t) {
    this.deltaTime = _t.deltaTime;
    if (!this.paused) {
      this.total += this.deltaTime;
    }
  }

  reset() {
    this.total = 0;
  }

  toggle() {
    this.paused ? this.start() : this.stop()
  }

  start() {
    if (this.total == 0) {
      this.startTime = Date.now();
    }
    this.paused = false;
    return this.startTime;
  }

  stop() {
    this.paused = true;
  }

  getTotal() {
    return this.total;
  }
}

module.exports = Timer;