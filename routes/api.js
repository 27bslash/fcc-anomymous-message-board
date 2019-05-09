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

mongoose.promise = global.Promise;
mongoose.set("debug", true);
mongoose.connect(process.env.DB);

module.exports = function(app) {
  app.use(helmet.dnsPrefetchControl());
  app.use(helmet.referrerPolicy({ policy: "same-origin" }));
  app.use(helmet.frameguard({ action: "sameorigin" }));

  app.route("/api/threads/:board").post(function(req, res) {
    const { board, text, delete_password } = req.body;
  });

  app.route("/api/replies/:board");
};
