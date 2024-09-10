const express = require("express");
const User = require("../models/User");
const { newFuel, getFuel } = require("../helpers/fuel");
const { turborPoints, dailyBonusPoints } = require("../helpers/user");
const { default: axios } = require("axios");
const { saveReferralCode, checkBonusStatus } = require("./bot");

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
  const { userId, name, username, refer } = req.query;
  console.log(req.query);
  try {
    let user = await User.findOne({ chatId: userId });
    let bonus = 0;
    let updateFlag = false;
    if (refer && refer !== userId) {
      bonus = await saveReferralCode(userId, refer, user);
    }
    if (user) {
      bonus = await checkBonusStatus(userId);
      if (name) {
        user.name = name;
        updateFlag = true;
      }
      if (username) {
        user.username = username;
        updateFlag = true;
      }
      if (bonus) {
        user.point += bonus;
        updateFlag = true;
      }
      const unlockAuthPilot =
        user.followTwitter &&
        user.watchvideo &&
        user.joinNewsletter &&
        user.joinAnnouncementChannel &&
        user.eligibility &&
        user.pluslevel &&
        user.liketweet &&
        user.reactPost &&
        user.subscribeUtv;

      let fuel = getFuel(userId, {
        fueltank: user.fueltank,
        fuelcount: 10 + user.fueltank * 2,
        fuelcapacity: 10 + user.fueltank * 2,
        turboCharger: user.turboCharger,
        autopilot: {
          enabled: unlockAuthPilot,
          started: unlockAuthPilot ? new Date() : null,
          earned: 0,
        },
      });
      if (fuel.autopilot.earned) {
        user.point = (user.point | 0) + fuel.autopilot.earned;
        updateFlag = true;
      }
      if (updateFlag) await user.save();
      res.json({
        point: user.point,
        fuel,
        user,
        autoearned: fuel.autopilot.earned,
        bonus,
      });
    } else {
      let user = await new User({
        chatId: userId,
        name,
        username,
        point: bonus || 0,
      }).save();
      let fuel = newFuel(userId, {});
      res.json({ msg: "ok", data: { point: user.point, fuel, user, bonus } });
    }
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/all", async (req, res) => {
  try {
    //  chatId: { $ne: userId }
    const users = await User.find({})
      .sort({
        point: -1,
      })
      .limit(100);
    const count = await User.countDocuments();
    res.json({ msg: "ok", data: users, count });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/upgrade-turbor", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point - turborPoints(user.turboCharger + 1);
    if (user.point < 0) return res.json({ msg: "error" });
    user.turboCharger = user.turboCharger + 1;
    await user.save();
    res.json({ msg: "ok", turboCharger: user.turboCharger, point: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + dailyBonusPoints(user.dailyBonus.level);
    user.dailyBonus = {
      level: user.dailyBonus.level + 1,
      check: true,
    };
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

//  daily visit alphanomics platform
router.get("/bonus-visit", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + dailyBonusPoints(user.dailyBonusVisit.level);
    user.dailyBonusVisit = {
      level: user.dailyBonusVisit.level + 1,
      check: true,
    };
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus-followx", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + 3000;
    user.followTwitter = true;
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus-joinannouncement", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + 3000;
    user.joinAnnouncementChannel = true;
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus-watchvideo", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + 5000;
    user.watchvideo = true;
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus-joinnewsletter", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + 3000;
    user.joinNewsletter = true;
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus-liketweet", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + 5000;
    user.liketweet = true;
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus-reactPost", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + 4000;
    user.reactPost = true;
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/bonus-subscribeUtv", async (req, res) => {
  const { userId } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    user.point = user.point + 5000;
    user.subscribeUtv = true;
    await user.save();
    res.json({ msg: "ok", data: user.point });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

router.get("/checkcsv", async (req, res) => {
  const { userId, wallet } = req.query;
  try {
    const user = await User.findOne({ chatId: userId });
    const response = await axios.get(
      `https://api.alphanomics.io/accounts/check_account/?wallet_address=${wallet}`
    );
    const result = response.data.points === null ? false : true;
    if (user && result) {
      if (!user.eligibility) {
        user.point += 20000;
      }
      user.eligibility = true;
      user.ethaddress = wallet;
      if (Number(response.data.points) >= 10) user.pluslevel = true;
      await user.save();
    }
    res.json({
      point: response.data.points,
      userPoint: user.point || 0,
      data: user && result,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
