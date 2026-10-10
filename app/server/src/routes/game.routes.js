const express = require('express');
const { get, post, remove, getGamesBySetting } = require('../controllers/game.controller');
const { jwt } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const schemas = require('../request.schemas');

const router = express.Router();

router.use(jwt);

router.get('/', validate(schemas.gamesQuery), get);

router.get('/filter/settings', validate(schemas.gameFilters), getGamesBySetting);

router.post('/', validate(schemas.game), post);

router.delete('/:userId', remove);

module.exports = router;
