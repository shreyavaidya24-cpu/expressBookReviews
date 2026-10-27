const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'book-review-lab-secret';

app.use(express.json());

app.use('/customer', session({
  secret: 'fingerprint_customer',
  resave: false,
  saveUninitialized: false
}));

// Verify login session and JWT for protected review routes
app.use('/customer/auth/*', (req, res, next) => {
  const authorization = req.session.authorization;

  if (!authorization || !authorization.accessToken) {
    return res.status(401).json({
      message: 'Please log in to access this resource.'
    });
  }

  try {
    const decoded = jwt.verify(authorization.accessToken, JWT_SECRET);

    if (decoded.username !== authorization.username) {
      return res.status(403).json({ message: 'Invalid authorization.' });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token. Please log in again.'
    });
  }
});

app.use('/customer', customer_routes);
app.use('/', genl_routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
