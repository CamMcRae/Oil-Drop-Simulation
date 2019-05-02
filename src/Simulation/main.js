let simulation;

module.exports.run = () => {

  function setup() {
    console.log("ASDA")
    simulation = new Simulation();
  }

  function draw() {
    simulation.update()
  }
}