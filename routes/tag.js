const express = require("express");
const {
  getTags,
  createTag,
  getTag,
  updateTag,
  deleteTag,
  filterTagSection,
} = require("../controllers/tagController");

const Tag = require("../models/Tag");

const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(advancedResults(Tag, [], filterTagSection), getTags)
  .get(advancedResults(Tag), getTags);

router.route("/new").post(createTag);

router.route("/:id").get(getTag).put(updateTag).delete(deleteTag);

module.exports = router;
