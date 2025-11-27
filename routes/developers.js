const express = require('express');
const router = express.Router();

const developersController = require('../controllers/developers');

router.get('/', developersController.getAll);
router.get('/:id', developersController.getSingle);

module.exports = router;