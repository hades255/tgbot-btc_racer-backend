const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = Schema({
  chatId: { type: String, required: true },
  name: { type: String, required: true },
  point: { type: Number, default: 0 },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
