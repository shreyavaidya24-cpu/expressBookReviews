const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const isValid = require('./auth_users.js').isValid;
const users = require('./auth_users.js').users;

const public_users = express.Router();
const API_BASE_URL = 'http://localhost:5000';

// Task 6: Register a user
public_users.post('/register', (req, res) => {
  const { username, password } = req.body || {};

  if (
    typeof username !== 'string' ||
    !username.trim() ||
    typeof password !== 'string' ||
    !password
  ) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  const cleanUsername = username.trim();

  if (isValid(cleanUsername)) {
    return res.status(409).json({
      message: 'Username already exists.'
    });
  }

  users.push({ username: cleanUsername, password });

  return res.status(201).json({
    message: 'User successfully registered.'
  });
});

// Task 1: Get all books
public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

// Task 2: Get a book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).json(book);
});

// Task 3: Get books by author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const matches = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );

  if (!matches.length) {
    return res.status(404).json({
      message: 'No books found for this author.'
    });
  }

  return res.status(200).json(matches);
});

// Task 4: Get books by title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const matches = Object.values(books).filter(
    book => book.title.toLowerCase() === title
  );

  if (!matches.length) {
    return res.status(404).json({
      message: 'No books found with this title.'
    });
  }

  return res.status(200).json(matches);
});

// Task 5: Get reviews by ISBN
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).json(book.reviews);
});

// Tasks 10–13: Axios with async/await

async function getAllBooksAsync() {
  const response = await axios.get(`${API_BASE_URL}/`);
  return response.data;
}

async function getBookByISBNAsync(isbn) {
  const response = await axios.get(
    `${API_BASE_URL}/isbn/${encodeURIComponent(isbn)}`
  );
  return response.data;
}

async function getBooksByAuthorAsync(author) {
  const response = await axios.get(
    `${API_BASE_URL}/author/${encodeURIComponent(author)}`
  );
  return response.data;
}

async function getBooksByTitleAsync(title) {
  const response = await axios.get(
    `${API_BASE_URL}/title/${encodeURIComponent(title)}`
  );
  return response.data;
}

module.exports.general = public_users;

module.exports.asyncQueries = {
  getAllBooksAsync,
  getBookByISBNAsync,
  getBooksByAuthorAsync,
  getBooksByTitleAsync
};
