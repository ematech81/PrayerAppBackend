const express = require("express");
const { param, body } = require("express-validator");

const { validate } = require("../middlewares/validateRequest");
const { likeLimiter, shareLimiter } = require("../middlewares/ratelimiter");
const {
  toggleLike,
  getLikeCount,
  shareVerse,
} = require("../controllers/verse.controllers");

const router = express.Router();

const validateId = param("id")
  .trim()
  .isLength({ min: 1 })
  .withMessage("Invalid verse id");

router.post(
  "/:id/likes/toggle",
  likeLimiter,
  validateId,
  body("userId").isString().trim().isLength({ min: 1, max: 128 }),
  validate,
  toggleLike
);

router.get("/:id/likes/count", likeLimiter, validateId, validate, getLikeCount);

router.post(
  "/:id/shares",
  shareLimiter,
  validateId,
  body("channel")
    .optional()
    .isIn(["whatsapp", "twitter", "copy", "system", "other"]),
  body("userId").optional().isString().trim().isLength({ min: 1, max: 128 }),
  validate,
  shareVerse
);

module.exports = router;

// const express = require("express");
// const { body } = require("express-validator");
// const { apiLimiter } = require("../middlewares/ratelimiter");
// const { validate } = require("../middlewares/validateRequest");
// const { likeVerse, shareVerse } = require("../controllers/verse.controllers");
// const router = express.Router();

// router.post(
//   "/:id/like",
//   apiLimiter,
//   body("count").isNumeric(),
//   validate,
//   likeVerse
// );

// router.post(
//   "/:id/share",
//   apiLimiter,
//   body("count").isNumeric(),
//   validate,
//   shareVerse
// );

// module.exports = router;
