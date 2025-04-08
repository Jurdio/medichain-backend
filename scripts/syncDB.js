require('dotenv').config();
const { sequelize } = require('../src/config/database');
const User = require('../src/models/User');

(async () => {
    try {
        await sequelize.sync({ force: false }); // Видаляє всі таблиці і створює їх знову
        console.log('✅ Таблиці успішно синхронізовані');
        process.exit(0);
    } catch (error) {
        console.error('❌ Помилка синхронізації БД:', error);
        process.exit(1);
    }
})();
