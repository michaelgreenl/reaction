const express = require('express');
const { get, put } = require('../controllers/settings.controller');
const { jwt } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const schemas = require('../request.schemas');

const router = express.Router();

router.use(jwt);
router.get('/', get);
router.put('/', validate(schemas.settings), put);

module.exports = router;
