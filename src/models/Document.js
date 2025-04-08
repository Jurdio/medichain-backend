const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');


class Document extends Model {
    // тут можеш додати кастомні методи, типу findByType, findByUser тощо
}

Document.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        imageUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        issueDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        type: {
            type: DataTypes.STRING, // наприклад: 'driver_license', 'education', 'passport'
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING, // наприклад: 'valid', 'expired', 'revoked'
            defaultValue: 'valid',
        }
    },
    {
        sequelize,
        modelName: 'Document',
        timestamps: true,
    }
);

module.exports = Document;
