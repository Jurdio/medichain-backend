const express = require('express');
const nftController = require('../controllers/nftController');
const router = express.Router();

router.post('/v1/nft/certificates', nftController.mint);

module.exports = router;
