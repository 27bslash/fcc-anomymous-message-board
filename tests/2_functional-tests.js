/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *       (if additional are added, keep them at the very end!)
 */

var chaiHttp = require("chai-http");
var chai = require("chai");
var assert = chai.assert;
var server = require("../server");
const mongoose = require("mongoose");
const threadModel = require("../Models/threads.js");
chai.use(chaiHttp);

suite("Functional Tests", function() {
  let id;
  let delete_id;
  suite("API ROUTING FOR /api/threads/:board", function() {
    mongoose.connection.collections.threads.drop();

    suite("POST", function() {
      test("POST a thread", function(done) {
        chai
          .request(server)
          .post("/api/threads/b")
          .send({ text: "test", delete_password: "p" })
          .end((err, res) => {
            console.log("tty");
            assert.equal(res.status, 200);
          });
        chai
          .request(server)
          .post("/api/threads/b")
          .send({ text: "test", delete_password: "p" })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("get all threads in a board", function(done) {
        chai
          .request(server)
          .get("/api/threads/b")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isAtLeast(res.body.length, 1);
            assert.isAtMost(res.body.length, 10);
            console.log("body[1]", res.body[1]);
            id = res.body[0]._id;
            delete_id = res.body[1]._id;
            console.log(id, delete_id);
            done();
          });
      });
      test("get all threads in all boards", function(done) {
        chai
          .request(server)
          .get("/api/threads")
          .end((err, res) => {
            assert.equal(res.status, 200);
            assert.isAtLeast(res.body.length, 1);
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("DELETE invalid _id", function(done) {
        chai
          .request(server)
          .delete("/api/threads/b")
          .send({ thread_id: "i", delete_password: "t" })
          .end((err, res) => {
            assert.equal(res.text, "invalid _id");
            done();
          });
        chai
          .request(server)
          .delete("/api/threads/b")
          .send({ thread_id: delete_id, delete_password: "t" })
          .end((err, res) => {
            assert.equal(res.text, "invalid password");
          });
        chai
          .request(server)
          .delete("/api/threads/b")
          .send({ thread_id: delete_id, delete_password: "p" })
          .end((err, res) => {
            console.log(delete_id, res.text);
            assert.equal(res.status, 200);
            assert.include(res.text, "delete successful ");
          });
      });
    });

    suite("PUT", function() {
      test("report a thread", function(done) {
        chai
          .request(server)
          .put("/api/threads/b")
          .send({ report_id: id, board: "b" })
          .end((err, res) => {
            assert.equal(res.text, "report successful");
          });
        chai
          .request(server)
          .put("/api/threads/b")
          .send({ report_id: id, board: "b" })
          .end((err, res) => {
            assert.notEqual(res.text, "report successful");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    let reply_id;
    suite("POST", function() {
      test("POST a reply to a thread", function(done) {
        chai
          .request(server)
          .post("/api/replies/b")
          .send({
            thread_id: id,
            text: "test",
            delete_password: "p"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
          });
        chai
          .request(server)
          .post("/api/replies/b")
          .send({
            thread_id: id,
            text: "test",
            delete_password: "p"
          })
          .end((err, res) => {
            assert.equal(res.status, 200);
            done();
          });
      });
    });

    suite("GET", function() {
      test("get all replies in a thread", function(done) {
        chai
          .request(server)
          .get("/api/replies/b")
          .query({ thread_id: id })
          .end(function(err, res) {
            console.log("body-test", res.body);
            reply_id = res.body.replies[0]._id;
            console.log(reply_id);
            assert.equal(res.status, 200);
            assert.property(res.body, "_id");
            assert.property(res.body, "created_on");
            assert.property(res.body, "bumped_on");
            assert.property(res.body, "text");
            assert.property(res.body, "replies");
            assert.notProperty(res.body, "delete_password");
            assert.notProperty(res.body, "reported");
            assert.isArray(res.body.replies);
            assert.notProperty(res.body.replies[0], "delete_password");
            assert.notProperty(res.body.replies[0], "reported");
            done();
          });
      });
    });
    suite("PUT", function() {
      test("report a reply", function(done) {
        chai
          .request(server)
          .put("/api/replies/b")
          .send({ thread_id: id, reply_id })
          .end((err, res) => {
            assert.equal(res.text, "report successful");
          });
        chai
          .request(server)
          .put("/api/replies/b")
          .send({ thread_id: id, reply_id })
          .end((err, res) => {
            assert.notEqual(res.text, "report successful");
            done();
          });
      });
    });

    suite("DELETE", function() {
      test("DELETE invalid _id", function(done) {
        chai
          .request(server)
          .delete("/api/replies/b")
          .send({ thread_id: id, reply_id: 'i', delete_password: "t" })
          .end((err, res) => {
            assert.equal(res.text, "invalid _id");
          });
        chai
          .request(server)
          .delete("/api/replies/b")
          .send({ thread_id: id, reply_id, delete_password: "t" })
          .end((err, res) => {
            assert.equal(res.text, "invalid password");
          });
        chai
          .request(server)
          .delete("/api/replies/b")
          .send({ thread_id: id, reply_id, delete_password: "p" })
          .end((err, res) => {
            console.log(delete_id, res.text);
            assert.equal(res.status, 200);
            assert.include(res.text, "delete successful ");  
            done();
          });
      });
    });
  });
});
