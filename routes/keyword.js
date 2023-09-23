const express = require("express");
const {
  getKeywords,
  createKeyword,
  getKeyword,
  updateKeyword,
  deleteKeyword,
  filterKeywordSection,
} = require("../controllers/keywordController");

const Keyword = require("../models/Keyword");

const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

router
  .route("/")
  .post(advancedResults(Keyword, [], filterKeywordSection), getKeywords)
  .get(advancedResults(Keyword), getKeywords);

router.route("/new").post(createKeyword);

router.route("/:id").get(getKeyword).put(updateKeyword).delete(deleteKeyword);

module.exports = router;
