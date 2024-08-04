const cookieParser = require('cookie-parser');
const express = require("express");
const logger = require('morgan');
const debug = require('debug')('backend:error');
const cors = require('cors');
const csurf = require('csurf');
const path = require('path');
const passport = require('passport');
const { isProduction } = require('./config/keys');

require('./models/User');
require('./models/Event');
require('./config/passport');

const usersRouter = require('./routes/api/users');
const csrfRouter = require('./routes/api/csrf');
const eventsRouter = require('./routes/api/events');

const app = express();

app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true
    }
  })
);

// Security Middleware
if (!isProduction) {
  // Enable CORS only in development because React will be on the React
  // development server (http://localhost:5173). (In production, React files
  // will be served statically on the Express server.)
  app.use(cors());
}

// Serve frontend static files in production
if (isProduction) {
  app.use(express.static(path.resolve(__dirname, '../frontend/dist')));

  app.get('/', (req, res) => {
    res.cookie('CSRF-TOKEN', req.csrfToken());
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  app.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('CSRF-TOKEN', req.csrfToken());
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
}

// Attach Express routers
app.use('/api/users', usersRouter);
app.use('/api/csrf', csrfRouter);
app.use('/api/events', eventsRouter);

// Custom error handler
app.use((err, req, res, next) => {
  debug(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    statusCode,
    errors: err.errors || [],
  });
});

// Handle 404 errors
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.statusCode = 404;
  next(err);
});

module.exports = app;
