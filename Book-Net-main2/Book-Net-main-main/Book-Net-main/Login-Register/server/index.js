const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Models
const Employeemodel = require("./models/Employee");
const Cartmodel = require("./models/Cart");
const OrderModel = require("./models/Order");
const BooksModel = require("./models/Books");
const ReadingBooksModel = require("./models/ReadingBooks");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- AUTH & USER --------------------

// Register
app.post('/register', (req, res) => {
    Employeemodel.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.json(err));
});

// Login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@booknet.com" && password === "12345") {
        return res.json({ status: "Success", role: "admin" });
    }

    Employeemodel.findOne({ email })
        .then(user => {
            if (!user) return res.json({ status: "Fail", message: "User not found" });
            if (user.password !== password) return res.json({ status: "Fail", message: "Incorrect password" });
            res.json({ status: "Success", role: "user" });
        })
        .catch(err => res.json({ status: "Error", message: err.message }));
});

// -------------------- CART --------------------

// Add to cart
app.post('/cart', (req, res) => {
    Cartmodel.create(req.body)
        .then(cartItem => res.json(cartItem))
        .catch(err => res.status(500).json(err));
});

// Get cart items for a user
app.get('/cart/:email', (req, res) => {
    Cartmodel.find({ email: req.params.email })
        .then(items => res.json(items))
        .catch(err => res.status(500).json(err));
});

// Delete cart item
app.delete('/cart/:id', (req, res) => {
    Cartmodel.findByIdAndDelete(req.params.id)
        .then(() => res.json({ message: "Deleted" }))
        .catch(err => res.status(500).json(err));
});

// Clear all cart items for a user
app.delete('/cart/clear/:email', (req, res) => {
    Cartmodel.deleteMany({ email: req.params.email })
        .then(() => res.json({ message: 'Cart cleared' }))
        .catch(err => res.status(500).json({ error: 'Failed to clear cart' }));
});

// Confirm order
app.post('/order/confirm', async (req, res) => {
    const { email } = req.body;
    try {
        const cartItems = await Cartmodel.find({ email });
        if (cartItems.length === 0) return res.status(400).json({ message: 'Cart is empty' });

        const ordersToInsert = cartItems.map(item => ({
            bookname: item.bookname,
            email: item.email,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            orderDate: new Date()
        }));

        await OrderModel.insertMany(ordersToInsert);
        res.json({ message: 'Order confirmed and saved' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error confirming order' });
    }
});

// -------------------- BOOKS (TDD READY) --------------------

// Add book
app.post("/books", async (req, res) => {
    try {
        const { title, author, price, category, image } = req.body;

        if (!title) return res.status(400).json({ message: "Title is required" });
        if (!author) return res.status(400).json({ message: "Author is required" });
        if (!price) return res.status(400).json({ message: "Price is required" });

        const book = await BooksModel.create({ title, author, price, category, image });
        res.status(201).json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get books
app.get("/books", async (req, res) => {
    try {
        const { category } = req.query;
        const filter = category ? { category } : {};
        const books = await BooksModel.find(filter);
        res.json(books);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update book
app.put("/books/:id", async (req, res) => {
    try {
        const updated = await BooksModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete book
app.delete("/books/:id", async (req, res) => {
    try {
        await BooksModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Book deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -------------------- READING BOOKS --------------------

// Add reading book
app.post("/newbooks", async (req, res) => {
    try {
        const book = await ReadingBooksModel.create(req.body);
        res.json(book);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get all reading books
app.get("/newbooks", async (req, res) => {
    try {
        const books = await ReadingBooksModel.find();
        res.json(books);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Get single reading book
app.get("/newbooks/:id", async (req, res) => {
    try {
        const book = await ReadingBooksModel.findById(req.params.id);
        res.json(book);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Update reading book
app.put("/newbooks/:id", async (req, res) => {
    try {
        const updated = await ReadingBooksModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json(err);
    }
});

// Delete reading book
app.delete("/newbooks/:id", async (req, res) => {
    try {
        await ReadingBooksModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Reading book deleted" });
    } catch (err) {
        res.status(500).json(err);
    }
});

// -------------------- MONGOOSE & SERVER --------------------

mongoose.connect("mongodb://localhost:27017/BookNet")
    .then(() => {
        console.log("MongoDB connected");

        if (require.main === module) {
            app.listen(3001, () => console.log("Server is running on port 3001"));
        }
    })
    .catch(err => console.error(err));

module.exports = app; // Export for Supertest
