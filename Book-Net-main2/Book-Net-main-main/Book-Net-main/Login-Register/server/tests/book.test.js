// server/tests/book.test.js
const request = require("supertest");
const mongoose = require("mongoose");
const chai = require("chai");
const expect = chai.expect;
const app = require("../index"); // your Express app

describe("Book API - TDD Example", function () {
  // Close MongoDB connection after tests
  after(async () => {
    await mongoose.connection.close();
  });

  it("Add a new book - should fail without title", async function () {
    const response = await request(app)
      .post("/books")
      .send({
        author: "Test Author",
        price: 100,
        category: "kids",
        image: "https://via.placeholder.com/150"
      });

    expect(response.status).to.equal(400); // validation fails
    expect(response.body.message).to.equal("Title is required");
  });

  it("Add a new book - should succeed with valid data", async function () {
    const response = await request(app)
      .post("/books")
      .send({
        title: "Test Book",
        author: "Test Author",
        price: 100,
        category: "kids",
        image: "https://via.placeholder.com/150"
      });

    expect(response.status).to.equal(201); // created
    expect(response.body.title).to.equal("Test Book");
    expect(response.body.category).to.equal("kids");
    expect(response.body.image).to.equal("https://via.placeholder.com/150");
  });
});




