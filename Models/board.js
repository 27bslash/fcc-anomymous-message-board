const mongoose = require("mongoose");
const Schema = new mongoose.Schema();
const thread = require("./thread.js");
const boardSchema = Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, unique: true },
  board: String,
  text: String,
  delete_pw: String,
  created_on: Date,
  bumped_on: Date,
  reported: Boolean,
  replies: [thread]
});

const boardModel = mongoose.model("board", boardSchema);
module.exports = boardModel;
