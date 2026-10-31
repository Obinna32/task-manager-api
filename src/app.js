const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const path = require('path');
const swaggerDocument = YAML.load(path.join(__dirname, '../docs/swagger.yaml'));

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan =require("morgan");
const mongoose = require("mongoose");
const mongoSanitize = require('express-mongo-sanitize');
const { env } = require("./config/env");
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middleware/error");
const authRouter = require("./routes/auth.routes");
const taskRouter = require("./routes/task.routes");

const app = express();

app.use(helmet());
app.use(cors());

console.log(swaggerDocument)

app.use((req, res, next) => {
    Object.defineProperty(req, 'query', {
        value: req.query,
        writable: true,
        configurable: true,
        enumerable: true,
    });
    next();
});


app.use(express.json({limit: '10kb'}));

app.use(mongoSanitize());

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


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req,res,next) => {
    next(new AppError(`Cant find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;