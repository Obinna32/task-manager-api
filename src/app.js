const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan =require("morgan");
const mongoose = require("mongoose");
const { env } = require("./config/env");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middleware/error");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({limit: '10kb'}));

if (env.NODE_ENV === "development"){
    app.use(morgan('dev'));
}

app.get('/health', (req,res)=> {
    res.status(200).json({
        status: 'success',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        dbState: mongoose.connection.readyState
    });
});

app.use((req,res,next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;