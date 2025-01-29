// DATA
const express = require('express');
const moviesController = require('../controllers/moviesController');
const router = express.Router();
const upload = require('../middlewares/fileUpload')

// INDEX
router.get('/', moviesController.index)

// SHOW
router.get('/:slug', moviesController.show)

// STORE MOVIE
router.post('/', upload.single("image"), moviesController.store)

// STORE MOVIE-REVIEW
router.post('/:slug/reviews', moviesController.storeReview)

// EXPORT
module.exports = router;