const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { env } = require("../config/env");

const signToken = (id) => {
    return jwt.sign({id}, env.JWT_SECRET, {expiresIn: env.JWT_EXPIRES_IN});
};

exports.register = catchAsync(async (req, res, next) => {
    const { name, email, password} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser){
        return next(new AppError("Email is already registered. Please log in.", 409));
    }

    const newUser = await User.create({ name, email, password});
    const token = signToken(newUser._id);

    newUser.password = undefined;

    res.status(201).json({ status: "success", token, data: {user: newUser}});
});