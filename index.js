const express = require('express');
const authMiddleware = require('./src/middleware/auth');
const basicAuth = require('./src/middleware/basicAuth');
const authRoutes = require('./src/routes/auth');
const documentRoutes = require('./src/routes/documentRoutes');
const ipfsRoutes = require('./src/routes/ipfsRoutes');
const nftRoutes = require('./src/routes/nftRoutes');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/docs', basicAuth, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/docs.html'));
});

app.get('/', (req, res) => {
    res.send('<h1>API працює. Перейдіть на <a href="/docs">/docs</a></h1>');
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/documents', documentRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
    res.json({ message: 'Доступ дозволено!', user: req.user });
});

app.use(nftRoutes);
app.use(ipfsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Сервер працює на порту ${PORT}`));
