const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  thread_id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  text: String,
  created_on: Date,
  bumped_on: Date,
  delete_pw: String,
  reported: true
});
module.exports = threadSchema;
