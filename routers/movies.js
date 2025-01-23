const express = require('express');
const moviesController = require('../controllers/moviesController');

const router = express.Router();

router.get('/', moviesController.index)

router.get('/:id', moviesController.show)

module.exports = router;