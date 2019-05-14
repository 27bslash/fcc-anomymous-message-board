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

mongoose.promise = global.Promise;
mongoose.set("debug", true);
mongoose.connect(process.env.DB);

module.exports = function(app) {
  const threadController = new threadHandler();
  // const replyHandler = new replyHandelr();
  app.route("/api/threads").get(threadController.findAllThreads);
  //   threadModel.find({}).then(doc => {
  //     res.send(doc);
  //   });
  // });
  app
    .route("/api/threads/:board")
    .post(threadController.createThread)
    .get(threadController.findThread)
    .put(threadController.reportThread)
    .delete(threadController.deleteThread);
  app
    .route("/api/replies/:board")
    .post((req, res) => {
      const { thread_id, text, board, delete_password } = req.body;
      console.log(req.body);
      if (mongoose.Types.ObjectId.isValid(thread_id)) {
        threadModel
          .findOne({ _id: thread_id })
          .then(doc => {
            doc.bumped_on = new Date();
            doc.replies.push({
              reply_id: mongoose.Types.ObjectId(),
              text,
              delete_password,
              created_on: new Date()
            });
            doc.save();
            res.send({ doc, redirect: `/${board}/${thread_id}` });
            console.log(doc);
          })
          .catch(err => { 
            res.send(err);
          });
      } else {
        res.send("invalid _id");
      }
    })
    .get((req, res) => {
      const thread_id = req.body;
      threadModel.findById(thread_id).then(doc => {
        console.log(doc);
      });
    });
};
