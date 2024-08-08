const cron = require("node-cron");
const { resetBoosts } = require("./fuel");
const User = require("../models/User");

/**
 * Daily cron job
 * - daily bonus
 * - daily fuel booster
 */
const updateDailyChecks = async () => {
  try {
    console.log("cron function called");
    //  fuel booster
    resetBoosts();
    //  format bonus
    const users = await User.find();
    users.forEach(async (user) => {
      if (user.dailyBonus.check) {
        user.dailyBonus.check = false;
      } else {
        user.dailyBonus.level = 0;
      }
      await user.save();
    });
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("0 0 * * *", updateDailyChecks, {
  scheduled: true,
  timezone: "EST",
});
