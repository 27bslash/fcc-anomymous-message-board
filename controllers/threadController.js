const mongoose = require("mongoose");
const express = require("express");
const threadModel = require("../Models/threads");

mongoose.set("useFindAndModify", false);
function threadHandler() {
  this.createThread = (req, res) => {
    const { board, text, delete_password } = req.body;
    const b = req.params.board;
    console.log("board", board, b);

    const threads = threadModel({
      _id: mongoose.Types.ObjectId(),
      board: b,
      text,
      delete_password,
      created_on: new Date(),
      bumped_on: new Date(),
      reported: false
    });
    threads.save();
    res.status(200).redirect(`/b/${b}/`);
  };
  this.findAllThreads = (req, res) => {
    threadModel
      .find()
      .then(doc => {
        res.send(doc);
      })
      .catch(err => {
        res.send(err);
      });
  };
  this.findThread = (req, res) => {
    threadModel
      .find(
        { board: req.params.board },
        "-reported -delete_password -replies.delete_password -replies.reported"
      )
      .sort({ bumped_on: -1 })
      .limit(10)
      .then(doc => {
        if (doc.length === 0) {
          console.log("invalid _id");
        } else {
          doc.forEach(docs => {
            docs.replyCount = docs.replies.length;
            if (docs.replyCount > 3) {
              docs.replies = docs.replies.slice(-3);
            }
          });
          res.send(doc);
        }
      });
  };

  this.reportThread = (req, res) => {
    const { board } = req.params;
    threadModel
      .findOneAndUpdate({ board, _id: req.body.report_id }, { reported: true })
      .then(doc => {
        if (doc.reported === true) {
          res.send("You have already reported this thread");
        } else {
          res.send("report successful");
        }
      })
      .catch(err => {
        res.send(err);
      });
  };
  this.deleteThread = (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.body.thread_id)) {
      console.log("_id ", req.body.thread_id);
      threadModel
        .findOneAndDelete({
          _id: req.body.thread_id,
          delete_password: req.body.delete_password
        })
        .then(doc => {
          console.log(doc);
          if (doc === null) {
            res.send("invalid password");
          } else {
            res.send("delete successful " + req.body.thread_id);
          }
        })
        .catch(err => {
          res.send(err);
        });
    } else {
      res.send("invalid _id");
    }
  };
}
module.exports = threadHandler;
