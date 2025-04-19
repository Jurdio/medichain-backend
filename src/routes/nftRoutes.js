const express = require('express');
const nftController = require('../controllers/nftController');
const router = express.Router();

router.post('/v1/nft/certificates', nftController.mint);
router.post('/v1/nft/draft', nftController.draft);

module.exports = router;
