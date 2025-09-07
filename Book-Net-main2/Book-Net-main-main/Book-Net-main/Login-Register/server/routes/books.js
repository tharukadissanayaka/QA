const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/books", async (req, res) => {
  const { title, author, price } = req.body;

  // Validation
  if (!title) return res.status(400).json({ message: "Title is required" });

  const newBook = new Book({ title, author, price });
  await newBook.save();

  res.status(201).json(newBook);
});

module.exports = router;
