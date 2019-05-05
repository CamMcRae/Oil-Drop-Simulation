class Timer {
  constructor(_s, _v) {
    this.start = Date.now();
    this.total = 0;
    this.speed = _s || 1;
    this.visible = _v || false;
    this.deltaTime = 0;
    this.previousTime = this.start;
  }

  show() {
    if (this.visible) {
      fill(255);
      noStroke();
      textAlign(LEFT, TOP);
      textSize(24);
      text(this.deltaTime, 5, 5);
    }
  }

  update() {
    this.total += this.deltaTime * this.speed
    let t = Date.now();
    this.deltaTime = t - this.previousTime;
    this.previousTime = t;
  }

  reset() {
    this.start = Date.now();
    this.total = 0;
    this.deltaTime = 0;
    this.previousTime - this.start;
  }
}

module.exports = Timer;