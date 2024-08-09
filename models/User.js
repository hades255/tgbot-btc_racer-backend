const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  chatId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, default: "" },
  point: { type: Number, default: 0 },
  //  task
  fueltank: { type: Number, default: 0 },
  turboCharger: { type: Number, default: 0 },
  dailyBonus: {
    level: { type: Number, default: 0 },
    check: { type: Boolean, default: false },
  },
  dailyBonusVisit: {
    level: { type: Number, default: 0 },
    check: { type: Boolean, default: false },
  },
  idVerified: { type: Boolean, default: false },
  followTwitter: { type: Boolean, default: false },
  connectTon: { type: Boolean, default: false },
  joinAnnouncementChannel: { type: Boolean, default: false },
  autoDriv: { type: Boolean, default: false },
  //  surprise
  signupAccount: { type: Boolean, default: false },
  installApp: { type: Boolean, default: false },
  connectTg: { type: Boolean, default: false },
  verify: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
