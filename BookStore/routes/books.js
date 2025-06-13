const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const upload = require('../middleware/upload');

// Get all books
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.render('books/index', { books });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Show form to add new book
router.get('/new', (req, res) => {
  res.render('books/new');
});

// Create new book
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const bookData = req.body;
    if (req.file) {
      bookData.image = '/images/books/' + req.file.filename;
    }
    const book = new Book(bookData);
    await book.save();
    res.redirect('/books');
  } catch (error) {
    res.status(400).render('books/new', { error: error.message });
  }
});

// Show single book
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.render('books/show', { book });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Show edit form
router.get('/:id/edit', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.render('books/edit', { book });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Update book
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const bookData = req.body;
    if (req.file) {
      bookData.image = '/images/books/' + req.file.filename;
    }
    const book = await Book.findByIdAndUpdate(req.params.id, bookData, { new: true });
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.redirect('/books');
  } catch (error) {
    res.status(400).render('books/edit', { error: error.message });
  }
});

// Delete book
router.delete('/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).send('Book not found');
    }
    res.redirect('/books');
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router; 