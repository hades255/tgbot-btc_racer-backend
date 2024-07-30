const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RaceSchema = Schema(
  {
    user: { type: String, required: true },
    guess: { type: String, required: true },
    result: { type: Boolean, default: false },
    pointAmount: { type: Number, default: 0 },
    consecutiveWins: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Race = mongoose.model("Race", RaceSchema);

module.exports = Race;
