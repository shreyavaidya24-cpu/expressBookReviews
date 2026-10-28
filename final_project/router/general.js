
const axios = require('axios');
const books = require('./booksdb.js');

const public_users = express.Router();
const API_BASE_URL = 'http://localhost:5000';

// Internal data endpoints: these access the local book database.
public_users.get('/_internal/books', (req, res) => {
  res.status(200).json(books);
});

public_users.get('/_internal/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found.' });
  }

  return res.status(200).json(book);
});

public_users.get('/_internal/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();

  const matches = Object.values(books).filter(
    book => book.author.toLowerCase() === author
  );

  if (matches.length === 0) {
    return res.status(404).json({
      message: 'No books found for this author.'
    });
  }

  return res.status(200).json(matches);
});

public_users.get('/_internal/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();

  const matches = Object.values(books).filter(
    book => book.title.toLowerCase() === title
  );

  if (matches.length === 0) {
    return res.status(404).json({
      message: 'No books found with this title.'
    });
  }

  return res.status(200).json(matches);
});

// Axios request helper with error handling.
async function axiosGet(path) {
  try {
    const response = await axios.get(`${API_BASE_URL}${path}`);
    return response.data;
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message ||
      'Unable to retrieve book data.';

    const requestError = new Error(message);
    requestError.status = status;
    throw requestError;
  }
}

// Tasks 10–13: Axios-based retrieval functions.
async function getAllBooksAsync() {
  return axiosGet('/_internal/books');
}

async function getBookByISBNAsync(isbn) {
  return axiosGet(`/ _internal/isbn/${encodeURIComponent(isbn)}`.replace('/ ', '/'));
}

async function getBooksByAuthorAsync(author) {
  return axiosGet(`/_internal/author/${encodeURIComponent(author)}`);
}

async function getBooksByTitleAsync(title) {
  return axiosGet(`/_internal/title/${encodeURIComponent(title)}`);
}

// Consistent HTTP response and error handling.
async function respondWithData(res, request) {
  try {
    const data = await request();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || 'Internal server error.'
    });
  }
}

// Public routes: retrieve results through Axios.
public_users.get('/', (req, res) =>
  respondWithData(res, getAllBooksAsync)
);

public_users.get('/isbn/:isbn', (req, res) =>
  respondWithData(res, () => getBookByISBNAsync(req.params.isbn))
);

public_users.get('/author/:author', (req, res) =>
  respondWithData(res, () => getBooksByAuthorAsync(req.params.author))
);

public_users.get('/title/:title', (req, res) =>
  respondWithData(res, () => getBooksByTitleAsync(req.params.title))
);
