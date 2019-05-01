let p5;
let simulation;

module.exports.run = () => {
  p5 = require("p5");
  // console.log(p5)

  function setup() {
    console.log("ASDA")
    simulation = new Simulation();
  }

  function draw() {
    simulation.update()
  }
}