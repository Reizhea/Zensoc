const express = require('express');
const router = express.Router();
const { getFacebookMessages } = require('../controllers/fbController');

router.get('/messages', getFacebookMessages);

module.exports = router;
