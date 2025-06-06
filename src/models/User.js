const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');
const Document = require('../models/Document');

class User extends Model {

    static async findByPhone(phone) {
        return await this.findOne({
            where: { phone },
            attributes: ['id', 'phone', 'password']
        });
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        refreshToken: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
    }
);

User.hasMany(Document, { foreignKey: 'userId' });
Document.belongsTo(User, { foreignKey: 'userId' });

module.exports = User;
