const router = require('express').Router();

router.get('/', (req, res) => {res.send('Hello World!')});

router.use('/developers', require('./developers'));

module.exports = router;

