const express = require("express");
const Race = require("../models/Race");
const User = require("../models/User");
const { newFuel, getFuel } = require("../helpers/fuel");
const { turborPoints } = require("../helpers/user");

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findOne({ chatId: userId });
    if (user) {
    } else {
      await new User({ chatId: userId }).save();
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/", async (req, res) => {
  const { userId, name, username } = req.query;
  try {
    let user = await User.findOne({ chatId: userId });
    if (user) {
      let updateFlag = false;
      if (name) {
        user.name = name;
        updateFlag = true;
      }
      if (username) {
        user.username = username;
        updateFlag = true;
      }
      if (updateFlag) await user.save();
      let fuel = getFuel(userId);
      if (fuel)
        res.json({ msg: "ok", data: { point: user.point, fuel, user } });
      else {
        let fuel = newFuel(userId, {
          fueltank: user.fueltank,
          fuelcount: 10 + user.fueltank * 2,
          fuelcapacity: 10 + user.fueltank * 2,
        });
        res.json({ msg: "ok", data: { point: user.point, fuel, user } });
      }
    } else {
      let user = await new User({ chatId: userId, name, username }).save();
      let fuel = newFuel(userId);
      res.json({ msg: "ok", data: { point: 0, fuel, user } });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/all", async (req, res) => {
  const { userId } = req.query;
  try {
    const users = await User.find({ chatId: { $ne: userId } }).sort({
      point: -1,
    });
    res.json({ msg: "ok", data: users });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/upgrade-turbor", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point - turborPoints(user.turboCharger + 1);
    user.turboCharger = user.turboCharger + 1;
    await user.save();
    res.json({ msg: "ok", turboCharger: user.turboCharger });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
