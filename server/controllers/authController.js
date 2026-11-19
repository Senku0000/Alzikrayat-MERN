const bcrypt = require('bcryptjs');
const User = require('../models/User');

const SALT_ROUNDS = 10;

/**
 * authController.js
 *
 * Handles the two basic-auth REST endpoints required by the spec:
 * registration (hash + store) and login (verify + return profile).
 * No JWT / sessions here by design — the client simply holds the
 * returned user object in React state (see Bonus Project 4 for JWT).
 */

/**
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { firstName, lastName, email, password, location, description, occupation } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: 'This email is already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      location,
      description,
      occupation,
    });

    // user.toJSON() (defined on the model) already strips the password
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const matches = await bcrypt.compare(password, user.password);
    if (!matches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
