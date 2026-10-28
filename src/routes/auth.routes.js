const express = require("express");
const authController = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimit");

const router = express.Router();

router.post("/register", authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post("/me", protect, authController.getMe);

module.exports = router;