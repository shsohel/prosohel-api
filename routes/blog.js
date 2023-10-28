const express = require("express");
const {
  getBlogs,
  createBlog,
  getBlog,
  updateBlog,
  deleteBlog,
  filterBlogSection,
} = require("../controllers/blogController");

const Blog = require("../models/Blog");

const advancedResults = require("../middleware/advancedResults");
const { getAllPosts } = require("../controllers/blogController");

const router = express.Router();

router
  .route("/")
  .post(
    advancedResults(Blog, ["category", "tag", "keyword"], filterBlogSection),
    getBlogs,
  )
  .get(advancedResults(Blog), getBlogs);

router.route("/new").post(createBlog);
router.route("/get-all-posts").get(getAllPosts);

router.route("/:id").get(getBlog).put(updateBlog).delete(deleteBlog);

module.exports = router;
