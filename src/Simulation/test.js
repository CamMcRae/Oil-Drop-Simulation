function SpritzOilData() {
  // creates random voltage
  Voltage = Math.floor(Math.random() * 100 + 100) / 10;
  // calculates electric field
  ElectricField = Voltage / PlateSeparationm;
  // makes 100 drops
  for (i = 0; i < 100; i++) {
    // radius from 20 - 70 UNITS
    dropradius[i] = Math.random() * 50 + 20;
    // drop charge, 0 - 8
    dropcharge[i] = Math.floor(Math.random() * 9 + 0);
    // position
    dropx[i] = 200;
    dropy[i] = 375;
    // velocity
    speedx[i] = 20;
    speedy[i] = 0;
    // raidus in meters
    radiusinm = dropradius[i] / 1e8;
    Volumedrop = 4 / 3 * Math.PI * Math.pow(radiusinm, 3);
    Massdrop = Volumedrop * DensityOfDrop;
    ForceGravityDrop = Massdrop * 9.8;
    ForceElectric = ElectricField * dropcharge[i] * 1.602e-19;
    NetForce = ForceGravityDrop - ForceElectric;
    accelerationy[i] = NetForce / Massdrop / 100;
    evaporationrate[i] = 0;
  }
  magicdrop = Math.floor(Math.random() * 99);
  ForceElectricMagicDrop = 1.602e-19 * dropcharge[magicdrop] * ElectricField;
  ForceGravityMagicDrop = ForceElectricMagicDrop;
  MassOfMagicDrop = ForceGravityMagicDrop / 9.8;
  VolumeOfMagicDrop = MassOfMagicDrop / DensityOfDrop;
  Garbage = VolumeOfMagicDrop * 3 / (4 * Math.PI);
  RadiusOfMagicDrop = Math.pow(Garbage, (1 / 3));
  dropradius[magicdrop] = RadiusOfMagicDrop * 1e6 * 100;
  accelerationy[magicdrop] = 0;
}