const mongoose = require("mongoose");
const express = require("express");
const threadModel = require("../Models/threads");
const bcrypt = require("bcrypt");
const saltRounds = 10;
mongoose.set("useFindAndModify", false);

class threadHandler {
  constructor() {
    this.createThread = (req, res) => {
      const { board, text, delete_password } = req.body;
      const b = req.params.board;
      console.log("board", board, b);
      bcrypt.hash(delete_password, saltRounds).then(hash => {
        const threads = threadModel({
          _id: mongoose.Types.ObjectId(),
          board: b,
          text,
          delete_password: hash,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false
        });
        threads.save();
        res.status(200).redirect(`/b/${b}/`);
      });
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
        .find({ board: req.params.board }, "-reported -delete_password -replies.delete_password -replies.reported")
        .sort({ bumped_on: -1 })
        .limit(10)
        .then(doc => {
          if (doc.length === 0) {
            console.log("invalid _id");
          }
          else {
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
          }
          else {
            res.status(200).send("report successful");
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
          .findOne({
            _id: req.body.thread_id
          })
          .then(doc => {
            console.log(doc);
            bcrypt
              .compare(req.body.delete_password, doc.delete_password)
              .then(result => {
                if (result) {
                  console.log("result");
                  doc.remove();
                  doc.save();
                  res.status(200).send("delete successful " + req.body.thread_id);
                }
                else { 
                  res.status(401).send("invalid password");
                }
              });
          })
          .catch(err => {
            res.send(err);
          });
      }
      else {
        res.send("invalid _id");
      }
    };
  }
}
module.exports = threadHandler;
