const express = require('express');
const authMiddleware = require('./src/middleware/auth');
const authRoutes = require('./src/routes/auth');
require('dotenv').config();

const app = express();
app.use(express.json());

// Маршрути
app.use('/api/auth', authRoutes);

// Захищений маршрут
app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Доступ дозволено!', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
