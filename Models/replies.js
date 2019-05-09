const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  reply_id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  text: String,
  created_on: Date,
  bumped_on: Date,
  delete_password: String,
  reported: Boolean
});
module.exports = threadSchema;
