const express = require('express');
const router = express.Router();
const {home} = require('../controllers/homeController');

const checkAuthentication = require('../middleware/checkAuthentication');

router.post('/', checkAuthentication, home);

module.exports = router;