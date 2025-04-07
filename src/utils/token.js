const jwt = require('jsonwebtoken');

function generateTokens(user) {
    const expiresInSec = 15 * 60; // 15 хвилин у секундах
    const expiresAt = new Date(Date.now() + expiresInSec * 1000);

    const accessToken = jwt.sign(
        { id: user.id, phone: user.phone },
        process.env.JWT_SECRET,
        { expiresIn: expiresInSec }
    );

    const refreshToken = jwt.sign(
        { id: user.id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    return {
        accessToken,
        refreshToken,
        expiresIn: expiresInSec,
        expiresAt: expiresAt.toISOString()
    };
}

module.exports = { generateTokens };
