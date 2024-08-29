const express = require("express");
const Race = require("../models/Race");
const User = require("../models/User");
const {
  useFuel,
  boostFuel,
  upgradeFuel,
  setAutopilot,
} = require("../helpers/fuel");
const { fuelTankPoints } = require("../helpers/user");

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const races = await Race.find({ user: userId })
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .exec();
    res.json({ msg: "ok", data: races });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/boost", async (req, res) => {
  const { userId } = req.query;
  boostFuel(userId);
  res.json({ msg: "ok" });
});

router.get("/upgrade-fuel", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point - fuelTankPoints(user.fueltank + 1);
    if (user.point < 0) return res.json({ msg: "error" });
    user.fueltank = user.fueltank + 1;
    await user.save();
    upgradeFuel(userId);
    res.json({ msg: "ok", point: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.post("/", async (req, res) => {
  const { guess, pointAmount, userId, result } = req.body;
  console.log(req.body);
  if (!guess || !pointAmount || !userId)
    return res.json({ msg: "error: fill in the input values" });
  try {
    const latestRace = await Race.findOne({ user: userId }).sort({
      createdAt: -1,
    });
    let consecutiveWins = 0;
    if (latestRace && latestRace.guess === guess && latestRace.result && result)
      consecutiveWins = 1; // latestRace.consecutiveWins + 1;
    await new Race({
      guess,
      pointAmount,
      user: userId,
      result,
      consecutiveWins,
    }).save();

    const user = await User.findOne({ chatId: userId });
    if (result) {
      user.point = (user.point || 0) + pointAmount;
      user.save();
    }

    useFuel(userId);
    res.json({ msg: "ok", data: user.point || 0 });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/activate-autopilot", (req, res) => {
  const { userId } = req.query;
  setAutopilot(userId);
  res.json({ msg: "ok" });
});

module.exports = router;
