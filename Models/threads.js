const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reply = require("./replies.js");

const threadSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  board: String,
  text: String,
  delete_password: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [reply]
});

const boardSchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  board: String,
  threads: [threadSchema]
});
const boardModel = mongoose.model("board", boardSchema);
const threadModel = mongoose.model("thread", threadSchema);
module.exports = threadModel;
