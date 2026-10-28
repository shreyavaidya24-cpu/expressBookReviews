
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

// Task 10: Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to retrieve books.' });
  }
});

// Task 11: Get a book by ISBN using Axios and async/await
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/isbn/${encodeURIComponent(req.params.isbn)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(
      error.response?.data || { message: 'Unable to retrieve book.' }
    );
  }
});

// Task 12: Get books by author using Axios and async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/author/${encodeURIComponent(req.params.author)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(
      error.response?.data || { message: 'Unable to retrieve books.' }
    );
  }
});

// Task 13: Get books by title using Axios and async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/title/${encodeURIComponent(req.params.title)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json(
      error.response?.data || { message: 'Unable to retrieve books.' }
    );
  }
});
