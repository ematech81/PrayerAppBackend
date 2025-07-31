const rateLimit = require("express-rate-limit");

const window15m = 15 * 60 * 1000;

exports.apiLimiter = rateLimit({
  windowMs: window15m,
  max: 100,
  message: "Too many requests from this IP, please try again later",
});

// Tighter limits for like/share actions
exports.likeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

exports.shareLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

// const rateLimit = require("express-rate-limit");

// exports.apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: "Too many requests from this IP, please try again later",
// });
