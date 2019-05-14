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
      });
      test("DELETE incorrect password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/b")
          .send({ thread_id: delete_id, delete_password: "t" })
          .end((err, res) => {
            assert.equal(res.text, "invalid password");
            done();
          });
      });
      test("DELETE correct password", function(done) {
        chai
          .request(server)
          .delete("/api/threads/b")
          .send({ thread_id: delete_id, delete_password: "p" })
          .end((err, res) => {
            console.log(delete_id, res.text);
            assert.equal(res.status, 200);
            assert.include(res.text, "delete successful ");
            done();
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
            console.log("body test", res.body.doc);
            assert.equal(res.status, 200);
            assert.isAtLeast(res.body.doc.replies.length, 1);
            assert.property(res.body.doc.replies[0], "text");
            assert.property(res.body.doc.replies[0], "delete_password");
            done();
          });
      });
    });

    suite("GET", function() {});

    suite("PUT", function() {});

    suite("DELETE", function() {});
  });
});
