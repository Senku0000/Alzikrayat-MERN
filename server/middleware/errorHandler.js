/**
 * errorHandler.js
 *
 * Centralized Express error-handling middleware. Any error passed to
 * next(err) anywhere in the app ends up here, so the client always
 * gets a consistent JSON error shape instead of an HTML stack trace.
 */
function errorHandler(err, req, res, next) {
  console.error(err);

  // Multer file-filter / size errors arrive with a .message already set
  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({ message });
}

module.exports = errorHandler;
