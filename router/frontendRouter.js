

const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const cookies = require('cookie-parser');
require('dotenv').config();

const secretKey = process.env.secretKey;
const refreshTokenSecret = process.env.refreshTokenSecret;

console.log(`refreshTokenSecret: ${refreshTokenSecret}`);

const protectedRoute = (req, res, next) => {
  try {
    console.log('Protected route middleware called');
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    console.log('Received cookies:', req.cookies);
    console.log('AccessToken:', accessToken);
    console.log('RefreshToken:', refreshToken);

    if (!accessToken && !refreshToken) {
      console.log('No access or refresh token found. Redirecting to login');
      return res.redirect('/login');
    }

    let decodedToken;
    let refreshDecodedToken;

    try {
      decodedToken = jwt.verify(accessToken, secretKey);
      console.log('decodedToken:', decodedToken);
    } catch (error) {
      console.log('Access token verification failed:', error.message);
    }

    try {
      refreshDecodedToken = jwt.verify(refreshToken, refreshTokenSecret);
      console.log('refreshDecodedToken:', refreshDecodedToken);
      const name = decodedToken?.name;
      res.cookie('name', name);
    } catch (error) {
      console.log('Refresh token verification failed:', error.message);
    }

    if (!decodedToken && !refreshDecodedToken) {
      console.log('No valid tokens found. Redirecting to login');
      return res.redirect('/login');
    }

    if (decodedToken || refreshDecodedToken) {
      console.log('Tokens verified successfully. Setting req.user');
      req.user = { id: decodedToken?.Nin || refreshDecodedToken?.Nin };
      return next();
    }
  } catch (error) {
    console.log('Error in protectedRoute middleware:', error.message);
    return res.redirect('/login');
  }
};

//this is meant to check if the user is an admin
const checkRole = (req, res,next) => {
    
}



const router = express.Router();
router.use(cookies());

router.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'landing.html'));
  console.log('landing page sent');
});

router.get('/login', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'login.html'));
  console.log('login page sent');
});

router.get('/signup', function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'signup.html'));
  console.log('signin page sent');
});

router.get('/home', protectedRoute, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'home.html'));
  console.log('home page sent');
});
router.get('/forgotPassword', protectedRoute, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'forgotPassword.html'));
  console.log('home page sent');
});

router.get('/verifyOtp', protectedRoute, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'verifyOtp.html'));
  console.log('home page sent');
});
router.get('/newPassword', protectedRoute, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'newPassword.html'));
  console.log('home page sent');
});
router.get('/messageUs', protectedRoute, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'messageUs.html'));
  console.log('messageUs page sent');
});
router.get('/adminOnlyLogin', protectedRoute, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'adminOnlyLogin.html'));
  console.log('messageUs page sent');
});
router.get('/adminHome', protectedRoute, function (req, res) {
  res.sendFile(path.resolve(__dirname, '../frontend', 'html', 'adminHome.html'));
  console.log('messageUs page sent');
});

module.exports = router;


