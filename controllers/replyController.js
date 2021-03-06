const mongoose = require("mongoose");
const threadModel = require("../Models/threads");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class replyHandler {
  constructor() {
    this.newReply = (req, res) => {
      const { thread_id, text, delete_password } = req.body;
      console.log(req.body);
      if (mongoose.Types.ObjectId.isValid(thread_id)) {
        bcrypt.hash(delete_password, saltRounds).then(hash => {
          threadModel
            .findOne({ _id: thread_id })
            .then(doc => {
              doc.bumped_on = new Date();
              doc.replies.push({
                _id: mongoose.Types.ObjectId(),
                text,
                delete_password: hash,
                created_on: new Date(),
                bumped_on: new Date(),
                reported: false
              });
              doc.replyCount = doc.replies.length;
              doc.save();
              res.redirect(`/b/${req.params.board}/`);
            })
            .catch(err => {
              res.send(err);
            });
        });
      }
      else {
        res.send("invalid _id");
      }
    };
    this.getReplies = (req, res) => {
      console.log("_id, ", req.body);
      threadModel
        .findOne({ board: req.params.board }, "-reported -delete_password -replies.delete_password -replies.reported")
        .then(doc => {
          res.send(doc);
        })
        .catch(err => {
          console.log(err);
          res.send(err);
        });
    };
    this.reportReply = (req, res) => {
      const { board } = req.params;
      const { reply_id, thread_id } = req.body;
      console.log("tst id", reply_id);
      threadModel
        .findOneAndUpdate({ _id: thread_id, "replies._id": reply_id }, { "replies.$.reported": true })
        .then(doc => {
          console.log();
          if (doc.replies.id(reply_id).reported === true) {
            res.send("You have already reported this thread");
          }
          else {
            res.send("report successful");
          }
        })
        .catch(err => {
          res.send(err);
        });
    };
    this.deleteReply = (req, res) => {
      const { reply_id, thread_id, delete_password } = req.body;
      console.log(req.body);
      if (mongoose.Types.ObjectId.isValid(reply_id)) {
        threadModel
          .findOne({
            _id: thread_id,
            "replies._id": reply_id
          })
          .then(doc => {
            console.log(doc.replies, delete_password, doc.replies.id(reply_id).delete_password);
            bcrypt
              .compare(delete_password, doc.replies.id(reply_id).delete_password)
              .then(result => {
                if (result) {
                  doc.replies.id(reply_id).remove();
                  doc.save();
                  res.status(200).send("delete successful ");
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
module.exports = replyHandler;
