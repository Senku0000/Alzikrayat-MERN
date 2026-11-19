const Joi = require('joi');

/**
 * validation.js
 *
 * Centralized Joi schemas for every write endpoint, plus a small
 * factory that turns a schema into Express middleware. On failure,
 * it responds 400 with every validation message collected at once.
 */

const registerSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required(),
  lastName: Joi.string().trim().max(50).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).required(),
  location: Joi.string().trim().allow('').optional(),
  description: Joi.string().trim().allow('').optional(),
  occupation: Joi.string().trim().allow('').optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

// multipart/form-data fields arrive as strings, so userId is a string here
const createPhotoSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().trim().allow('').optional(),
  userId: Joi.string().hex().length(24).required(),
});

const deletePhotoSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
});

const createCommentSchema = Joi.object({
  userId: Joi.string().hex().length(24).required(),
  comment: Joi.string().trim().min(1).required(),
});

/**
 * Builds Express middleware that validates `source` ('body' or
 * 'query') against the given Joi schema.
 *
 * @param {Joi.Schema} schema
 * @param {'body'|'query'} source
 * @returns {import('express').RequestHandler}
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((d) => d.message),
      });
    }

    req[source] = value;
    next();
  };
}

module.exports = {
  validate,
  registerSchema,
  loginSchema,
  createPhotoSchema,
  deletePhotoSchema,
  createCommentSchema,
};
