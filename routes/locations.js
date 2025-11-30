const express = require('express');
const router = express.Router();

const locationsController = require('../controllers/locations');

router.get('/', locationsController.getAll);
router.get('/:id', locationsController.getSingle);

router.post('/', locationsController.createLocation);
router.put('/:id', locationsController.updateLocation);

router.delete('/:id', locationsController.deleteLocation);

module.exports = router