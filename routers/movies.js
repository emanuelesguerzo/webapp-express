// DATA
const express = require('express');
const moviesController = require('../controllers/moviesController');
const router = express.Router();

// ROUTERS
router.get('/', moviesController.index)

router.get('/:slug', moviesController.show)

// EXPORT
module.exports = router;