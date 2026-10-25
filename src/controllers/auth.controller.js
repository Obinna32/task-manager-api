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

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password, user.password))){
        return next(new AppError('Incorrect email or Password', 401));
    }

    const token = signToken(user._id);

    user.password = undefined;

    res.status(200).json({ status: 'success', token, data: {user}});
});