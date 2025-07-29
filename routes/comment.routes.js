const router = require("express").Router();
const {
  createComment,
  likeComment,
  deleteComment,
} = require("../controllers/comment.controllers");

const { body } = require("express-validator");
const { validate } = require("../middleware/validate");

// create root comment or reply
router.post(
  "/",
  [
    body("verseId").notEmpty().withMessage("verseId is required"),
    body("userId").notEmpty().withMessage("userId is required"),
    body("content").notEmpty().withMessage("Content is required"),
  ],
  validate,
  createComment
);

// like/unlike comment
router.post(
  "/:id/like",
  [body("userId").notEmpty().withMessage("userId is required")],
  validate,
  likeComment
);

// soft delete
router.delete("/:id", deleteComment);

module.exports = router;

// const router = require("express").Router();
// const {
//   createComment,
//   likeComment,
//   deleteComment,
// } = require("../controllers/comment.controllers");
// const { body, param } = require("express-validator");
// const { validate } = require("../middlewares/validate");

// router.post(
//   "/",
//   [
//     body("userId").notEmpty().withMessage("userId is required"),
//     body("content").notEmpty().withMessage("Comment content is required"),
//   ],
//   validate,
//   createComment
// );

// router.post(
//   "/:id/like",
//   [
//     param("id").isMongoId().withMessage("Invalid comment ID"),
//     body("userId").notEmpty().withMessage("userId is required"),
//   ],
//   validate,
//   likeComment
// );

// router.delete(
//   "/:id",
//   [param("id").isMongoId().withMessage("Invalid comment ID")],
//   validate,
//   deleteComment
// );

// module.exports = router;
