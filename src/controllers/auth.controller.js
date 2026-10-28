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

exports.getMe = (req, res, next) => {
    res.status(200).json({status: 'success', data: { user: req.user}});
};

exports.updatePassword = catchAsync(async (req, res, next) => {
    const {currentPassword, newPassword} = req.body;

    if (!currentPassword || !newPassword){
        return next(new AppError('Please provide both current and new passwords', 400));
    }

    const user = await User.findById(req.user._id).select('+password');

    if (!(await user.comparePassword(currentPassword, user.password))){
        return next(new AppError('Your current password is incorrect', 401));
    }

    user.password = newPassword;
    await user.save();

    const token = signToken(user._id);

    res.status(200).json({ status: 'success', token, message: 'Password updated successfully'});
});