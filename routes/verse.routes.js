const express = require("express");
const { body } = require("express-validator");
const { apiLimiter } = require("../middlewares/ratelimiter");
const { validate } = require("../middlewares/validateRequest");
const { likeVerse, shareVerse } = require("../controllers/verse.controllers");
const router = express.Router();

router.post(
  "/:id/like",
  apiLimiter,
  body("count").isNumeric(),
  validate,
  likeVerse
);

router.post(
  "/:id/share",
  apiLimiter,
  body("count").isNumeric(),
  validate,
  shareVerse
);

module.exports = router;
