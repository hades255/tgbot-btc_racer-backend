const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referralSchema = new Schema({
  code: { type: String, required: true },
  userId: { type: String, required: true },
  bonus: { type: Number, default: 0 },
  timestamp: Date,
});

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
