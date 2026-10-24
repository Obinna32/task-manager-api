const mongoose = require("mongoose");
const app = require("./app");
const {env} = require("./config/env")
const {connectDB}  = require('./config/db');

connectDB.then(() => {
    const server = app.listen(env.PORT, () => {
        console.log(`Server running in ${env.NODE_ENV} mode on ${env.PORT}`);
    });
    process.on('unhandledRejection', (err) => {
        console.error('UNHANDLED REJECTION, Shutting down...');
        console.error(err.name, err.message);
        server.close(() => {
            process.exit(1);
        });
    });
});