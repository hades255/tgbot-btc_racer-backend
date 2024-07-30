const express = require("express");
const Race = require("../models/Race");

const router = express.Router();

router.get("/", async (req, res) => {
  const { userId } = req.query;
  try {
    const races = await Race.find({ user: userId }).sort({
      createdAt: -1,
    });
    res.json({ msg: "ok", data: races });
  } catch (error) {
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
    if (latestRace && latestRace.guess === guess && latestRace.result)
      consecutiveWins = 1; // latestRace.consecutiveWins + 1;
    const race = await new Race({
      guess,
      pointAmount,
      user: userId,
      result,
      consecutiveWins,
    }).save();

    res.json({ msg: "ok", data: race });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
});

module.exports = router;
