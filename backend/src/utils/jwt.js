const jwt = require('jsonwebtoken');

const generateToken = (payload) => jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
  expiresIn: process.env.JWT_EXPIRES_IN || '7d'
});

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET || 'secret');

module.exports = { generateToken, verifyToken };
