const express = require('express');

const router = express.Router();

router.use('/users', require('./user.routes'));
router.use('/stats', require('./stats.routes'));
router.use('/game', require('./game.routes'));
router.use('/settings', require('./settings.routes'));

module.exports = router;
