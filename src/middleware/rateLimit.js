const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
    max: 5,
    windowMs: 15 * 60 * 60,
    message: {
        status: 'fail',
        message: 'Too many request from this IP, please try again in 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = { authLimiter };