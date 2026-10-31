const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { lowercase, minLength } = require("zod");

const userSchema = new mongoose.Schema({
    name: {type: String, required: [true, 'Please tell us your name!'], trim: true},
    email: {type: String, required: [true, 'Please provide your email'], unique: true, lowercase: true, trim: true, index: true},
    role: {type: String, enum: ['user', 'admin'], default: 'user'},
    password: {type: String, required: [true, 'Please provide a password'], minLength: 8, select: false}
},
{timestamps: true});

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;