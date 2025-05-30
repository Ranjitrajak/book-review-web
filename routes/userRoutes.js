const express = require('express');
const { createUser, signIn } = require('../controllers/userController');
const { authValidation } = require('../utils/validates');
const router = express.Router();

router.post("/signup",authValidation.signup,createUser)
router.post('/login',authValidation.login,signIn)

module.exports = router;