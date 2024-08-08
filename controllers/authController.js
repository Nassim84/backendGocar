const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Users } = require("../models");
const { validationResult } = require("express-validator");
const logger = require("../utils/logger");

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const { name, firstname, email, password, role, campus } = req.body;

		// Vérifier si un utilisateur avec la même adresse email existe déjà
		const existingUser = await Users.findOne({ where: { email } });
		if (existingUser) {
			logger.warn(
				`Registration failed: Email already exists - Email: ${email}`
			);
			return res.status(400).json({ error: "Email already exists" });
		}

		// Hasher le mot de passe
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Créer un nouvel utilisateur
		const newUser = await Users.create({
			name,
			firstname,
			email,
			password: hashedPassword,
			role,
			campus,
		});

		logger.info(`User registered successfully - Email: ${email}`);
		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		logger.error(
			`Server error during registration - Email: ${email}, Error: ${error.message}`
		);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}

	try {
		const { email, password } = req.body;

		// Vérifier si l'utilisateur existe
		const user = await Users.findOne({ where: { email } });
		if (!user) {
			logger.warn(
				`Login attempt failed: Invalid email or password - Email: ${email}`
			);
			return res.status(400).json({ error: "Invalid email or password" });
		}

		// Vérifier le mot de passe
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			logger.warn(
				`Login attempt failed: Invalid email or password - Email: ${email}`
			);
			return res.status(400).json({ error: "Invalid email or password" });
		}

		// Générer un jeton d'authentification (JWT)
		const token = jwt.sign(
			{ userId: user.id, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: process.env.JWT_EXPIRATION || "1h" }
		);

		logger.info(`User logged in successfully - Email: ${email}`);
		res.status(200).json({ token, role: user.role });
	} catch (error) {
		logger.error(
			`Server error during login - Email: ${email}, Error: ${error.message}`
		);
		res.status(500).json({ error: "Internal server error" });
	}
};
