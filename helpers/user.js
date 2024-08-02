const fuelTankPoints = (lvl) => {
  switch (lvl) {
    case 0:
      return 500;
    case 1:
      return 1500;
    case 2:
      return 3000;
    case 3:
      return 6000;
    default:
      return 9000;
  }
};

module.exports = { fuelTankPoints };
