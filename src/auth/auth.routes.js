const express = require("express");
const { getNonce, login } = require("./auth.controller");

const router = express.Router();

router.post("/nonce", getNonce);

router.post("/login", login);

module.exports = router;
