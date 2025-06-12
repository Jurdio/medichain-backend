require('dotenv').config();
const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');
const MintDraft = require('../src/models/MintDraft');

(async () => {
    try {
        await sequelize.sync({ force: false });
        console.log('✅ Таблиці успішно синхронізовані');
        process.exit(0);
    } catch (error) {
        console.error('❌ Помилка синхронізації БД:', error);
        process.exit(1);
    }
})();
