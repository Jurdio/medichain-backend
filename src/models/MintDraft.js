const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class MintDraft extends Model {
    static async findById(id) {
        return await this.findOne({
            where: { id },
        });
    }

    static async findByPhone(phone) {
        return await this.findAll({
            where: { phone },
            order: [['createdAt', 'DESC']],
        });
    }

    static async markAsPaid(id) {
        return await this.update(
            {
                status: 'paid',
                paidAt: new Date(),
            },
            {
                where: { id },
            }
        );
    }

    static async markAsMinted(id, mintTx) {
        return await this.update(
            {
                status: 'minted',
                mintTx,
            },
            {
                where: { id },
            }
        );
    }
}

MintDraft.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
        },
        publicKey: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        type: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        metadataHash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'paid', 'minted'),
            allowNull: false,
            defaultValue: 'pending',
        },
        paidAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        mintTx: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'MintDraft',
        timestamps: true,
    }
);

module.exports = MintDraft;
