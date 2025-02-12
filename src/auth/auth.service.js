const crypto = require("crypto");
const nacl = require("tweetnacl");
const jwt = require("jsonwebtoken");
const bs58 = require("bs58").default;

const nonces = new Map(); // Тимчасове сховище для nonce

exports.generateNonce = (publicKey) => {
    const nonce = crypto.randomBytes(16).toString("hex");
    nonces.set(publicKey, nonce);
    return nonce;
};

exports.verifySignature = (publicKey, signature) => {
    const nonce = nonces.get(publicKey);
    if (!nonce) return null; // Nonce не знайдено або вже використано

    const message = new TextEncoder().encode(nonce);

    try {
        const signatureUint8 = new Uint8Array(Buffer.from(signature, "base64"));
        const publicKeyUint8 = bs58.decode(publicKey); // ✅ Використовуємо bs58

        if (publicKeyUint8.length !== 32) {
            console.error("❌ Некоректний розмір publicKey:", publicKeyUint8.length);
            return null;
        }

        const isVerified = nacl.sign.detached.verify(message, signatureUint8, publicKeyUint8);
        if (!isVerified) return null;

        // 🔥 Якщо все добре – створюємо JWT
        const token = jwt.sign({ publicKey }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return token;
    } catch (error) {
        console.error("❌ Помилка верифікації підпису:", error);
        return null;
    }
};
