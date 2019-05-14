const mongoose = require("mongoose");

const threadSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  text: String,
  created_on: Date,
  delete_password: String,
  reported: Boolean
});
module.exports = threadSchema;
