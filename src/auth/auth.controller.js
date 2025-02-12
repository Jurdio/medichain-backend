const authService = require("./auth.service");

exports.getNonce = (req, res) => {
    const { publicKey } = req.body;
    if (!publicKey) return res.status(400).json({ error: "Public key required" });

    const nonce = authService.generateNonce(publicKey);
    res.json({ nonce });
};

exports.login = (req, res) => {
    const { publicKey, signature } = req.body;
    if (!publicKey || !signature) return res.status(400).json({ error: "Missing parameters" });

    const token = authService.verifySignature(publicKey, signature);
    if (!token) return res.status(401).json({ error: "Invalid signature" });

    res.json({ token });
};
