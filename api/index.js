var express = require('express');
var router = express.Router();
var authenticate = require('./authenticate');
var authController = require('./controllers/auth');

router.get('/login', authController.login);
router.get('/logout', authenticate, authController.logout);
router.get('/signup', authController.signup);
router.get('/test', authenticate, authController.test);

module.exports = router;
