const express = require("express");
const User = require("../models/User");
const Referral = require("../models/Referral");

const router = express.Router();

router.get("/frens", async (req, res) => {
  const { userId } = req.query;
  try {
    let userIds = await Referral.distinct("userId", {
      $or: [{ userId }, { code: userId }],
    }).exec();
    if (!userIds.includes(userId)) {
      userIds = [...userIds, userId];
    }
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
