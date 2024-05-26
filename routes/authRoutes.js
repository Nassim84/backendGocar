const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const logger = require("../utils/logger");

const router = express.Router();

// Middleware de logging pour les routes d'authentification
router.use((req, res, next) => {
	logger.info(`Auth route accessed: ${req.method} ${req.originalUrl}`);
	next();
});

router.post(
	"/register",
	[
		body("name").notEmpty().withMessage("Name is required"),
		body("firstname").notEmpty().withMessage("Firstname is required"),
		body("email").isEmail().withMessage("Invalid email"),
		body("password")
			.isLength({ min: 8 })
			.withMessage("Password must be at least 8 characters long")
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
			.withMessage(
				"Password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
		body("role").isIn(["student", "admin"]).withMessage("Invalid role"),
		body("campus").isIn(["Avignon", "Pertuis"]).withMessage("Invalid campus"),
	],
	authController.register
);

router.post(
	"/login",
	[
		body("email").isEmail().withMessage("Invalid email"),
		body("password").notEmpty().withMessage("Password is required"),
	],
	authController.login
);

module.exports = router;
