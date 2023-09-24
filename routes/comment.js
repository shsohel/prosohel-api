const express = require("express");

const Comment = require("../models/Comment");

const advancedResults = require("../middleware/advancedResults");
const {
  createComment,
  filterCommentSection,
  getCategories,
  getComment,
  updateComment,
  deleteComment,
  getCommentWithReplay,
} = require("../controllers/CommentController");

const router = express.Router();

router
  .route("/")
  .post(
    advancedResults(Comment, ["user", "blog"], filterCommentSection),
    getCategories,
  )
  .get(advancedResults(Comment), getCategories);

router.route("/new").post(createComment);
router.route("/get-comment-with-replay").get(getCommentWithReplay);

router.route("/:id").get(getComment).put(updateComment).delete(deleteComment);

module.exports = router;
