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
  //  daily
  dailyBonus: {
    level: { type: Number, default: 0 },
    check: { type: Boolean, default: false },
  },
  dailyBonusVisit: {
    level: { type: Number, default: 0 },
    check: { type: Boolean, default: false },
  },
  idVerified: { type: Boolean, default: false },
  connectTon: { type: Boolean, default: false },
  //  one time
  followTwitter: { type: Boolean, default: false },
  watchvideo: { type: Boolean, default: false },
  joinAnnouncementChannel: { type: Boolean, default: false },
  joinNewsletter: { type: Boolean, default: false },
  //  surprise
  autoDriv: { type: Boolean, default: false },
  signupAccount: { type: Boolean, default: false },
  installApp: { type: Boolean, default: false },
  connectTg: { type: Boolean, default: false },
  verify: { type: Boolean, default: false },
  eligibility: { type: Boolean, default: false },
  ethaddress: { type: String, default: "" },
  pluslevel: { type: Boolean, default: false },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
