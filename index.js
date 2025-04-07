const express = require('express');
const authMiddleware = require('./src/middleware/auth');
const authRoutes = require('./src/routes/auth');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/docs.html'));
});

app.get('/', (req, res) => {
    res.send('<h1>API працює. Перейдіть на <a href="/docs">/docs</a></h1>');
});

app.use('/api/v1/auth', authRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Доступ дозволено!', user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
