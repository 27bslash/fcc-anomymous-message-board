/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const dotenv = require("dotenv").config();
const expect = require("chai").expect;
const mongoose = require("mongoose");
const threadModel = require("../Models/threads.js");
const threadHandler = require("../controllers/threadController.js");
const replyHandler = require("../controllers/replyController");

mongoose.promise = global.Promise;
mongoose.set("debug", true);
mongoose.connect(process.env.DB);

module.exports = function(app) {
  const threadController = new threadHandler();
  const replyController = new replyHandler();

  app.route("/api/threads").get(threadController.findAllThreads);
  app
    .route("/api/threads/:board")
    .post(threadController.createThread)
    .get(threadController.findThread)
    .put(threadController.reportThread)
    .delete(threadController.deleteThread);
    
  app
    .route("/api/replies/:board")
    .post(replyController.newReply)
    .get(replyController.getReplies)
    .put(replyController.reportReply)
    .delete(replyController.deleteReply);
};
