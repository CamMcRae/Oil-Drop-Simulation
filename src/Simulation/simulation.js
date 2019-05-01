class simulation {
  constructor(_gfs) {
    this.gfs = _gfs;
    this.efs = 0;
    this.pAir = 0.0000181;
    this.time = new Timer();

    this.drop = new Droplet();
  }

  update() {
    this.time.update();
    this.show();
  }

  show() {

  }
}