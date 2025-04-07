const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
    console.log('🔍 Перевірка JWT...'); // Додаємо лог

    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('❌ Токен відсутній');
        return res.status(401).json({ error: 'Неавторизований доступ' });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        console.log('✅ JWT пройшов перевірку:', decoded);
        next();
    } catch (err) {
        console.log('🚨 Помилка JWT:', err.message);
        return res.status(403).json({ error: 'Невалідний токен' });
    }
};


module.exports = authMiddleware;
