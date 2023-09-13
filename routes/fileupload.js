const express = require('express');

const {
  photoUpload,
  photoNextUpload,
  removeFile,
  getAllFiles,
} = require('../controllers/fileUploadController');
const advancedResults = require('../middleware/advancedResults');
const File = require('../models/File');

const router = express.Router();

router.route('/').get(advancedResults(File), getAllFiles);

router.route('/photo').post(photoUpload);
router.route('/photo/client').post(photoNextUpload);
router.route('/:fileName').delete(removeFile);

module.exports = router;
