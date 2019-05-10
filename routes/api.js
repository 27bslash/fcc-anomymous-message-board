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
const helmet = require("helmet");
const threadModel = require("../Models/threads.js");

mongoose.promise = global.Promise;
mongoose.set("debug", true);
mongoose.connect(process.env.DB);

module.exports = function(app) {
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.referrerPolicy({ policy: "same-origin" }));
  app.use(helmet.frameguard({ action: "sameorigin" }));

  app.route("/api/threads").get((req, res) => {
    threadModel.find({}).then(doc => {
      res.send(doc);
    });
  });
  app
    .route("/api/threads/:board")
    .post(function(req, res) {
      const { board, text, delete_password } = req.body;
      let result = {
        _id: mongoose.Types.ObjectId(),
        board,
        text,
        delete_password,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false
      };
      const threads = threadModel({
        _id: result._id,
        board,
        text,
        delete_password,
        created_on: new Date(),
        bumped_on: new Date(),
        reported: false
      });
      threads.save();
      res.send(result);
    })
    .get((req, res) => {
      threadModel
        .find(
          { board: req.params.board },
          "board text created_on bumped_on replies"
        )
        .sort({ bumped_on: -1 })
        .limit(5)
        .then(doc => {
          if (doc.length === 0) {
            res.send("invalid _id");
          } else {
            res.send(doc);
            console.log(doc.length, new Date());
          }
        });
    })
    .put((req, res) => {
      const { thread_id, board } = req.body;
      threadModel.findOne({ board, _id: thread_id }).then(doc => {
        console.log(thread_id, board, req.body);
        if (doc.length === 0) {
          res.send("invalid id");
        } else {
          doc.reported = true;
          doc.save();
          res.send("report successful");
        }
      });
    });
  app.route("/api/replies/:board");
};
