const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const regd_users = express.Router();
const users = [];

const JWT_SECRET = process.env.JWT_SECRET || 'book-review-lab-secret';

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};

// Task 7: Login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required.'
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: 'Invalid username or password.'
    });
  }

  const accessToken = jwt.sign({ username }, JWT_SECRET, {
    expiresIn: '1h'
  });

  req.session.authorization = { username, accessToken };

  return res.status(200).json({
    message: 'Login successful.',
    accessToken
  });
});

// Task 8: Add or update a review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({
      message: 'Provide a review using ?review=your_review'
    });
  }

  const username = req.session.authorization.username;
  books[isbn].reviews[username] = review.trim();

  return res.status(200).json({
    message: 'Review added or updated successfully.',
    reviews: books[isbn].reviews
  });
});

// Task 9: Delete the logged-in user's review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!books[isbn]) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  const username = req.session.authorization.username;

  if (!Object.prototype.hasOwnProperty.call(books[isbn].reviews, username)) {
    return res.status(404).json({
      message: 'You have no review for this book to delete.'
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: 'Your review was deleted successfully.',
    reviews: books[isbn].reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
