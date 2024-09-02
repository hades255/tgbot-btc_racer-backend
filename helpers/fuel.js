const { dateDiffInMins } = require("./func");

let FUELs = [];

const FUEL = {
  id: "",
  fuelcapacity: 10,
  fuelcount: 10,
  cooldown: 0,
  freeBoost: 3,
  fueltank: 0,
  turboCharger: 0,
  autopilot: {
    enabled: false,
    started: null,
    earned: 0,
  },
};

const newFuel = (id, { ...rest }) => {
  const nfuel = { ...FUEL, ...rest, id };
  FUELs.push(nfuel);
  return nfuel;
};

const getFuel = (id, options = {}) => {
  console.log(id, FUELs);
  const fuel = FUELs.find((item) => item.id.toString() === id.toString());
  if (fuel) {
    if (fuel.autopilot.enabled) {
      const earned = getAutopilotEarn(
        fuel.autopilot.started,
        fuel.turboCharger
      );
      resetAutopilot(fuel);
      return {
        ...fuel,
        autopilot: {
          enabled: false,
          started: null,
          earned,
        },
      };
    }
    return fuel;
  } else return newFuel(id, options);
};

const getFuels = () => FUELs;

const setFuel = (item_) =>
  (FUELs = FUELs.map((item) =>
    item.id.toString() === item_.id.toString() ? { ...item_ } : { ...item }
  ));

const boostFuel = (id_) => {
  FUELs = FUELs.map(
    ({ id, fuelcount, cooldown, freeBoost, fuelcapacity, ...rest }) => {
      if (id.toString() === id_.toString()) {
        if (freeBoost > 0) {
          fuelcount += 3;
          if (fuelcount >= fuelcapacity) {
            fuelcount = fuelcapacity;
            cooldown = 0;
          }
          freeBoost--;
        }
      }
      return { id, fuelcount, cooldown, freeBoost, fuelcapacity, ...rest };
    }
  );
};

const upgradeFuel = (id_) => {
  FUELs = FUELs.map(({ id, fuelcount, fueltank, fuelcapacity, ...rest }) => {
    if (id.toString() === id_.toString()) {
      fueltank++;
      fuelcount += 2;
      fuelcapacity += 2;
    }
    return { id, fuelcount, fueltank, fuelcapacity, ...rest };
  });
};

const useFuel = (id_) => {
  FUELs = FUELs.map(({ id, fuelcount, cooldown, ...rest }) => {
    if (id.toString() === id_.toString() && fuelcount > 0) {
      fuelcount -= 1;
      cooldown = cooldown || 89;
    }
    return { id, fuelcount, cooldown, ...rest };
  });
  console.log(FUELs);
};

const resetBoosts = () => {
  FUELs = FUELs.map((item) => ({ ...item, freeBoost: 3 }));
};

const getAutopilotEarn = (started) =>
  (dateDiffInMins(new Date(), new Date(started)) / 60) * 500;

const resetAutopilot = (fuel) => {
  setFuel({
    ...fuel,
    autopilot: {
      enabled: false,
      started: null,
      earned: 0,
    },
  });
};

const setAutopilot = (id) => {
  const fuel = FUELs.find((item) => item.id.toString() === id.toString());
  setFuel({
    ...fuel,
    autopilot: {
      enabled: true,
      started: new Date(),
      earned: 0,
    },
  });
};

const timerFunc = () => {
  setTimeout(() => {
    timerFunc();
  }, 1000);
  const fuels = getFuels();
  fuels.forEach(({ fuelcount, cooldown, fuelcapacity, autopilot, ...rest }) => {
    let updateFlag = false;
    if (fuelcount < fuelcapacity) {
      updateFlag = true;
      cooldown--;
      if (cooldown <= 0) {
        cooldown = 0;
        fuelcount++;
        if (fuelcount >= fuelcapacity) fuelcount = fuelcapacity;
        else {
          cooldown = 90;
        }
      }
    }
    if (autopilot.enabled) {
      if (dateDiffInMins(new Date(), new Date(autopilot.started)) >= 180) {
        updateFlag = true;
        const earned = 1500; //getAutopilotEarn(autopilot.started, rest.turboCharger);
        autopilot = {
          enabled: false,
          started: null,
          earned,
        };
      }
    }
    if (updateFlag)
      setFuel({
        fuelcount,
        cooldown,
        fuelcapacity,
        autopilot,
        ...rest,
      });
  });
};

// const timer = setInterval(() => {  //  find more stable way for timer
timerFunc();
// }, 1000);

module.exports = {
  newFuel,
  getFuel,
  boostFuel,
  useFuel,
  upgradeFuel,
  resetBoosts,
  getAutopilotEarn,
  resetAutopilot,
  setAutopilot,
};
