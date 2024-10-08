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
      return 10000 + (lvl - 4) * 6000;
  }
};

const turborPoints = (lvl) => {
  switch (lvl) {
    case 0:
      return 1000;
    case 1:
      return 3000;
    case 2:
      return 5000;
    case 3:
      return 10000;
    default:
      return 15000 + (lvl - 4) * 7000;
  }
};

const dailyBonusPoints = (lvl) => {
  switch (lvl) {
    case 0:
      return 1000;
    case 1:
      return 3000;
    case 2:
      return 5000;
    case 3:
      return 10000;
    default:
      return 15000 + (lvl - 4) * 4000;
  }
};

module.exports = { fuelTankPoints, turborPoints, dailyBonusPoints };
