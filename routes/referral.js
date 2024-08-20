const express = require("express");
const User = require("../models/User");
const Referral = require("../models/Referral");

const router = express.Router();

router.get("/frens", async (req, res) => {
  const { userId } = req.query;
  try {
    let userIds1 = await Referral.distinct("userId", {
      $or: [{ userId }, { code: userId }],
    }).exec();
    let userIds2 = await Referral.distinct("code", {
      $or: [{ userId }, { code: userId }],
    }).exec();
    const userIds = userIds1.concat(userIds2).reduce((acc, item) => {
      if (!acc.includes(item)) {
        acc.push(item);
      }
      return acc;
    }, []);

    const frens = await User.find({ chatId: { $in: userIds } })
      .sort({
        point: -1,
      })
      .limit(100);
    res.json({ msg: "ok", frens });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
