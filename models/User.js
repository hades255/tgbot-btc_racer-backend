const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  chatId: { type: String, required: true },
  score: { type: Number, default: 0 },
});
