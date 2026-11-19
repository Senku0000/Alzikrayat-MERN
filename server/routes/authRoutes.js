const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');

// POST /api/auth/register
router.post('/register', validate(registerSchema), authController.register);

// POST /api/auth/login
router.post('/login', validate(loginSchema), authController.login);

module.exports = router;
