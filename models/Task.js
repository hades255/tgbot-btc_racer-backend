const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = Schema(
  {
    user: { type: String, required: true },
    taskName: { type: String, required: true },
    completed: { type: Boolean, default: false },
    pointAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;
