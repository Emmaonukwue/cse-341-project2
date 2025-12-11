const express = require('express');
const router = express.Router();

const developersController = require('../controllers/developers');

const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', developersController.getAll);
router.get('/:id', developersController.getSingle);
router.post('/', isAuthenticated, developersController.createDeveloper);
router.put('/:id', isAuthenticated, developersController.updateDeveloper);
router.delete('/:id', isAuthenticated, developersController.deleteDeveloper);

module.exports = router