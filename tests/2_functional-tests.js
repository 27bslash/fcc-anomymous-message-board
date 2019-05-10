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
  suite("API ROUTING FOR /api/threads/:board", function() {
    // mongoose.connection.collections.threads.drop();               
    let id;
    suite("POST", function() {
      test("POST a thread", function(done) {
        chai
          .request(server)
          .post("/api/threads/b")
          .send({ board: "b", text: "test", delete_password: "p" })
          .end((err, res) => {
            id = res.body._id;
            assert.property(res.body, "text");
            assert.property(res.body, "delete_password");
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
            console.log(res.body);
            assert.isAtLeast(res.body.length, 1);
            done();
          });
      });
      test("get all threads in a board", function(done) {
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

    suite("DELETE", function() {});

    suite("PUT", function() {
      test("report a thread", function(done) {
        chai
          .request(server)
          .put("/api/threads/b")
          .send({ thread_id: id, board: "b" })
          .end((err, res) => {
            assert.equal(res.text, "report successful");
            done();
          });
      });
    });
  });

  suite("API ROUTING FOR /api/replies/:board", function() {
    suite("POST", function() {});

    suite("GET", function() {});

    suite("PUT", function() {});

    suite("DELETE", function() {});
  });
});
