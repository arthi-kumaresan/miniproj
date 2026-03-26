const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({ message: 'Invalid ID format' });
    }

    if (err.code === 11000) {
        return res.status(400).json({ message: 'Duplicate field value. This already exists.' });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({ message: 'Invalid token' });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired' });
    }

    res.status(err.statusCode || 500).json({
        message: err.message || 'Internal Server Error'
    });
};

module.exports = errorHandler;
