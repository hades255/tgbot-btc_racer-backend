let FUELs = [];

const newFuel = (id) => {
  if (FUELs.find((item) => item.id === id));
  else FUELs.push({ id, fuelcount: 10, cooldown: 0, freeBoost: 3 });
};

const getFuel = (id) => {
  if (FUELs.find((item) => item.id === id))
    return FUELs.find((item) => item.id === id);
  else {
    newFuel(id);
    return {
      id,
      fuelcount: 10,
      cooldown: 0,
      freeBoost: 3,
    };
  }
};

const getFuels = () => FUELs;

const setFuel = ({ id, cooldown, fuelcount, freeBoost }) => {
  FUELs = FUELs.map((item) =>
    item.id === id ? { id, cooldown, fuelcount, freeBoost } : { ...item }
  );
};

const boostFuel = (id_) => {
  FUELs = FUELs.map(({ id, fuelcount, cooldown, freeBoost }) => {
    if (id === id_) {
      if (freeBoost > 0) {
        fuelcount += 3;
        if (fuelcount >= 10) {
          fuelcount = 10;
          cooldown = 0;
        }
        freeBoost--;
      }
    }
    return { id, fuelcount, cooldown, freeBoost };
  });
};

const useFuel = (id_) => {
  FUELs = FUELs.map(({ id, fuelcount, cooldown, freeBoost }) => {
    if (id === id_ && fuelcount > 0) {
      fuelcount -= 1;
      cooldown = cooldown || 85;
    }
    return { id, fuelcount, cooldown, freeBoost };
  });
};

module.exports = { newFuel, getFuel, boostFuel, useFuel };

const timerFunc = () => {
  const fuels = getFuels();
  console.log(fuels)
  fuels.forEach(({ id, fuelcount, cooldown, freeBoost }) => {
    if (fuelcount >= 10) return;
    cooldown--;
    if (cooldown <= 0) {
      cooldown = 0;
      fuelcount++;
      if (fuelcount >= 10) fuelcount = 10;
      else {
        cooldown = 90;
      }
    }
    setFuel({ id, fuelcount, cooldown, freeBoost });
  });
};

const timer = setInterval(() => {
  timerFunc();
}, 1000);
