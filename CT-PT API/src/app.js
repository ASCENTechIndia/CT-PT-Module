const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const { config, validateConfig } = require('./config/env');
const routes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/error-handler');
const { attachResponseHelpers } = require('./libs/response');

function createApp() {
  validateConfig();

  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.corsOrigin === '*' ? true : config.corsOrigin.split(',').map((x) => x.trim()),
      credentials: true,
    })
  );
  app.use(compression());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(attachResponseHelpers);
  // app.use(
  //   rateLimit({
  //     windowMs: config.rateLimitWindowMs,
  //     max: config.rateLimitMax,
  //     standardHeaders: true,
  //     legacyHeaders: false,
  //   })
  // );

  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = {
  createApp,
};
