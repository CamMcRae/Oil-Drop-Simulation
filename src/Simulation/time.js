class Timer {
  constructor(_s) {
    this.speed = _s || 1;
    this.reset();
  }

  update(_t) {
    this.deltaTime = _t.deltaTime;
    if (!this.paused) {
      this.total += this.deltaTime * this.speed
    }
  }

  reset() {
    this.paused = false;
    this.total = 0;
  }

  getTotal() {
    console.log(this.total);
  }

  toggle() {
    this.paused ? this.start() : this.stop()
  }

  start() {
    if (this.total == 0) {
      this.start = Date.now();
    }
    this.paused = false;
  }

  stop() {
    this.paused = true;
  }
}

module.exports = Timer;