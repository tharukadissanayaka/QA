import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "./NavBar";
import "./Admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState("selling");

  // Selling books
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    image: "",
    category: "kids",
  });
  const [editingId, setEditingId] = useState(null);

  // Reading books
  const [readingBooks, setReadingBooks] = useState([]);
  const [readingForm, setReadingForm] = useState({
    title: "",
    author: "",
    price: "",
    image: "",
    chapter: "",
    content: "",
  });
  const [readingEditingId, setReadingEditingId] = useState(null);

  // Notification message
  const [message, setMessage] = useState("");

  // Fetch books
  const fetchSellingBooks = () => {
    axios.get("http://localhost:3001/books")
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  };

  const fetchReadingBooks = () => {
    axios.get("http://localhost:3001/newbooks")
      .then(res => setReadingBooks(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSellingBooks();
    fetchReadingBooks();
  }, []);

  // Selling book submit
  const handleSubmitSelling = e => {
    e.preventDefault();
    const request = editingId
      ? axios.put(`http://localhost:3001/books/${editingId}`, form)
      : axios.post("http://localhost:3001/books", form);

    request.then(() => {
      setMessage(editingId ? "Selling Book updated!" : "Selling Book added!");
      setForm({ title: "", author: "", price: "", image: "", category: "kids" });
      setEditingId(null);
      fetchSellingBooks();
    });
  };

  // Reading book submit
  const handleSubmitReading = e => {
    e.preventDefault();
    const request = readingEditingId
      ? axios.put(`http://localhost:3001/newbooks/${readingEditingId}`, readingForm)
      : axios.post("http://localhost:3001/newbooks", readingForm);

    request.then(() => {
      setMessage(readingEditingId ? "Reading Book updated!" : "Reading Book added!");
      setReadingForm({ title: "", author: "", price: "", image: "", chapter: "", content: "" });
      setReadingEditingId(null);
      fetchReadingBooks();
    });
  };

  // Delete handlers
  const handleDeleteSelling = id => {
    axios.delete(`http://localhost:3001/books/${id}`)
      .then(() => {
        setMessage("Selling Book deleted!");
        fetchSellingBooks();
      });
  };

  const handleDeleteReading = id => {
    axios.delete(`http://localhost:3001/newbooks/${id}`)
      .then(() => {
        setMessage("Reading Book deleted!");
        fetchReadingBooks();
      });
  };

  return (
    <div className="admin-page">
      <NavBar activePage="admin" />

      <div className="admin-container">
        <h2>Admin Panel</h2>

        {/* Notification */}
        {message && <div className="notification">{message}</div>}

        {/* Tabs */}
        <div className="tabs">
          <button
            className={activeTab === "selling" ? "active" : ""}
            onClick={() => setActiveTab("selling")}
          >
            Selling Books
          </button>
          <button
            className={activeTab === "reading" ? "active" : ""}
            onClick={() => setActiveTab("reading")}
          >
            Reading Books
          </button>
        </div>

        {/* Selling Books */}
        {activeTab === "selling" && (
          <>
            <form onSubmit={handleSubmitSelling}>
              <input type="text" name="title" placeholder="Book Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <input type="text" name="author" placeholder="Author" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} required />
              <input type="number" name="price" placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              <input type="text" name="image" placeholder="Image URL" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} required />
              <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                <option value="kids">Kids</option>
                <option value="romantic">Romantic</option>
                <option value="scifi">Sci-Fi</option>
                <option value="thriller">Thriller</option>
                <option value="historical">Historical</option>
                <option value="fantasy">Fantasy</option>
              </select>
              <button type="submit">{editingId ? "Update" : "Add"} Book</button>
            </form>

            <h3>All Selling Books</h3>
            <ul>
              {books.map(book => (
                <li key={book._id}>
                  <span>{book.title} - {book.category} (Rs.{book.price})</span>
                  <div className="actions">
                    <button onClick={() => { setForm(book); setEditingId(book._id); }}>Edit</button>
                    <button onClick={() => handleDeleteSelling(book._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Reading Books */}
        {activeTab === "reading" && (
          <>
            <form onSubmit={handleSubmitReading}>
              <input type="text" name="title" placeholder="Book Title" value={readingForm.title} onChange={e => setReadingForm({ ...readingForm, title: e.target.value })} required />
              <input type="text" name="chapter" placeholder="Chapter" value={readingForm.chapter} onChange={e => setReadingForm({ ...readingForm, chapter: e.target.value })} required />
              <input type="text" name="author" placeholder="Author" value={readingForm.author} onChange={e => setReadingForm({ ...readingForm, author: e.target.value })} required />
              <input type="number" name="price" placeholder="Price" value={readingForm.price} onChange={e => setReadingForm({ ...readingForm, price: e.target.value })} required />
              <input type="text" name="image" placeholder="Image URL" value={readingForm.image} onChange={e => setReadingForm({ ...readingForm, image: e.target.value })} required />
              <textarea placeholder="Book Content" value={readingForm.content} onChange={e => setReadingForm({ ...readingForm, content: e.target.value })} required></textarea>
              <button type="submit">{readingEditingId ? "Update" : "Add"} Book</button>
            </form>

            <h3>All Reading Books</h3>
            <ul>
              {readingBooks.map(book => (
                <li key={book._id}>
                  <span>{book.title} - (Rs.{book.price})</span>
                  <div className="actions">
                    <button onClick={() => { setReadingForm(book); setReadingEditingId(book._id); }}>Edit</button>
                    <button onClick={() => handleDeleteReading(book._id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default Admin;
