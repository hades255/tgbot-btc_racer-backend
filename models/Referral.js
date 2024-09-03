const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const referralSchema = new Schema({
  code: { type: String, required: true }, //  sender
  userId: { type: String, required: true }, //  receiver
  bonus: { type: Number, default: 0 },
  status: { type: Boolean, default: false },
  read: { type: Boolean, default: false },
  timestamp: Date,
});

const Referral = mongoose.model("Referral", referralSchema);

module.exports = Referral;
