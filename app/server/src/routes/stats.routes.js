const express = require('express');
const { get } = require('../controllers/stats.controller');
const { jwt } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(jwt);
router.get('/', get);

module.exports = router;
