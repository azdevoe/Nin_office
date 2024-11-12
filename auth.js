const jwt = require('jsonwebtoken');
require('dotenv').config();

// Generate a strong secret key
const secretKey=process.env.secretKey
const refreshTokenSecret=process.env.refreshTokenSecret

console.log(`secretKey: ${secretKey}, refreshTokenSecret: ${refreshTokenSecret}`);

// Set a reasonable token expiration time (1 hour)
const tokenExpirationTime = 3600; // 1 hour

// Generate a token
const generateToken = (user) => {
  const token = jwt.sign(user, secretKey, { expiresIn: tokenExpirationTime });
  return token;
};

// Verify a token


function generateRefreshToken(user) {
const refreshToken = jwt.sign(user,refreshTokenSecret,{expiresIn: '7d'})
return refreshToken
}

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, refreshTokenSecret);
  } catch (error) {
    console.error('Refresh token verification failed:', error.message);
    return null;
  }
};


module.exports = { generateToken, verifyToken ,generateRefreshToken,verifyRefreshToken};

