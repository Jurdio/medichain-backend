const Document = require('../models/Document');

exports.createDocument = async (req, res) => {
    try {
        const { title, description, imageUrl, issueDate, expiryDate, type, userId } = req.body;

        const document = await Document.create({
            title,
            description,
            imageUrl,
            issueDate,
            expiryDate,
            type,
            userId,
        });

        res.status(201).json(document);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка при створенні документа' });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const { page = 1, limit = 10, type, userId } = req.query;
        const offset = (page - 1) * limit;

        const where = {};
        if (type) where.type = type;
        if (userId) where.userId = userId;

        const { rows: documents, count } = await Document.findAndCountAll({
            where,
            offset: parseInt(offset),
            limit: parseInt(limit),
            order: [['createdAt', 'DESC']],
        });

        res.status(200).json({
            data: documents,
            pagination: {
                total: count,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(count / limit),
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Помилка при отриманні документів' });
    }
};
