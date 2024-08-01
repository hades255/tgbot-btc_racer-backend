const express = require("express");
const Race = require("../models/Race");
const User = require("../models/User");

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
    const user = await User.findOne({ chatId: userId });
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
      res.json({ msg: "ok", data: user.point });
    } else {
      await new User({ chatId: userId, name, username }).save();
      res.json({ msg: "ok", data: 0 });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/all", async (req, res) => {
  const { userId } = req.query;
  //  $ne: { chatId: userId }
  try {
    const users = await User.find({}).sort({
      point: -1,
    });
    res.json({ msg: "ok", data: users });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;
