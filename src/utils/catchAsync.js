module.exports = (fn) => {
    return(req, res, next) => {
        fn(req, res, next).catch(next);
    };
};


//using a catchAsync wrapper ensures that any rejected promises in asynchronous controllers automatically reach the global error handler without needing repetitive try/catch blocks.