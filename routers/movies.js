// DATA
const express = require('express');
const moviesController = require('../controllers/moviesController');
const router = express.Router();

// INDEX
router.get('/', moviesController.index)

// SHOW
router.get('/:slug', moviesController.show)

// STORE MOVIE REVIEW
router.post('/:slug/reviews', moviesController.storeReview)

// EXPORT
module.exports = router;