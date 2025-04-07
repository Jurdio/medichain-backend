const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./../models/User');
const { generateTokens } = require('./../utils/token');
require('dotenv').config();

const router = express.Router();

// Логін
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findByPhone(phone);
        if (!user) return res.status(404).json({ message: 'Користувача не знайдено' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Невірний пароль' });

        const tokens = generateTokens(user);

        user.refreshToken = tokens.refreshToken;
        await user.save();

        res.json(tokens);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

// Реєстрація
router.post('/register', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { phone } });
        if (existingUser) {
            return res.status(400).json({ message: 'Користувач вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            phone,
            password: hashedPassword
        });

        const tokens = generateTokens(newUser);

        newUser.refreshToken = tokens.refreshToken;
        await newUser.save();

        res.status(201).json({
            message: 'Користувача створено',
            ...tokens
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'Refresh токен не надано' });

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(payload.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Недійсний токен' });
        }

        const newAccessToken = jwt.sign(
            { id: user.id, phone: user.phone },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        res.json({ accessToken: newAccessToken });
    } catch (err) {
        console.error(err);
        return res.status(403).json({ message: 'Недійсний або прострочений токен' });
    }
});

router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findByPk(payload.id);
        if (user) {
            user.refreshToken = null;
            await user.save();
        }
        res.json({ message: 'Вийшли з системи' });
    } catch {
        res.status(200).json({ message: 'Вийшли з системи' }); // навіть якщо токен недійсний
    }
});


module.exports = router;
