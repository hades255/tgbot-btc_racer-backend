let FUELs = [];

const FUEL = {
  id: "",
  fuelcapacity: 10,
  fuelcount: 10,
  cooldown: 0,
  freeBoost: 3,
  fueltank: 0,
};

const newFuel = (id, { ...rest }) => {
  FUELs.push({ ...FUEL, ...rest, id });
  return FUEL;
};

const getFuel = (id) => FUELs.find((item) => item.id === id);

const getFuels = () => FUELs;

const setFuel = (item_) =>
  (FUELs = FUELs.map((item) =>
    item.id === item_.id ? { ...item_ } : { ...item }
  ));

const boostFuel = (id_) => {
  FUELs = FUELs.map(
    ({ id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity }) => {
      if (id === id_) {
        if (freeBoost > 0) {
          fuelcount += 3;
          if (fuelcount >= fuelcapacity) {
            fuelcount = fuelcapacity;
            cooldown = 0;
          }
          freeBoost--;
        }
      }
      return { id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity };
    }
  );
};

const upgradeFuel = (id_) => {
  FUELs = FUELs.map(
    ({ id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity }) => {
      if (id === id_) {
        fueltank++;
        fuelcount += 2;
        fuelcapacity += 2;
      }
      return { id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity };
    }
  );
};

const useFuel = (id_) => {
  FUELs = FUELs.map(
    ({ id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity }) => {
      if (id === id_ && fuelcount > 0) {
        fuelcount -= 1;
        cooldown = cooldown || 85;
      }
      return { id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity };
    }
  );
};

const timerFunc = () => {
  const fuels = getFuels();
  fuels.forEach(
    ({ id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity }) => {
      if (fuelcount >= fuelcapacity) return;
      cooldown--;
      if (cooldown <= 0) {
        cooldown = 0;
        fuelcount++;
        if (fuelcount >= fuelcapacity) fuelcount = fuelcapacity;
        else {
          cooldown = 90;
        }
      }
      setFuel({ id, fuelcount, cooldown, freeBoost, fueltank, fuelcapacity });
    }
  );
};

const timer = setInterval(() => {
  timerFunc();
}, 1000);

module.exports = { newFuel, getFuel, boostFuel, useFuel, upgradeFuel };
