const { Users } = require("../models");
const logger = require("../utils/logger");

exports.getProfiles = async (req, res) => {
	try {
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 10;
		const offset = (page - 1) * limit;

		const { count, rows: users } = await Users.findAndCountAll({
			limit,
			offset,
		});

		const totalPages = Math.ceil(count / limit);

		res.json({
			users,
			currentPage: page,
			totalPages,
			totalUsers: count,
		});
	} catch (error) {
		logger.error("Error retrieving profiles:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Récupérer le profil de l'utilisateur
exports.getProfile = async (req, res) => {
	try {
		const userId = req.userId; // Supposons que le middleware d'authentification ajoute l'userId à la requête

		const user = await Users.findByPk(userId, {
			attributes: { exclude: ["password"] }, // Exclure le mot de passe de la réponse
		});

		if (!user) {
			logger.warn(`User not found with id: ${userId}`);
			return res.status(404).json({ error: "User not found" });
		}

		logger.info(`User profile retrieved successfully for id: ${userId}`);
		res.status(200).json(user);
	} catch (error) {
		logger.error(`Error retrieving user profile for id ${userId}:`, error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Mettre à jour le profil de l'utilisateur
exports.updateProfile = async (req, res) => {
	try {
		const userId = req.userId;
		const { name, firstname, email, campus } = req.body;

		const user = await Users.findByPk(userId);

		if (!user) {
			logger.warn(`User not found with id: ${userId}`);
			return res.status(404).json({ error: "User not found" });
		}

		user.name = name || user.name;
		user.firstname = firstname || user.firstname;
		user.email = email || user.email;
		user.campus = campus || user.campus;

		await user.save();

		logger.info(`User profile updated successfully for id: ${userId}`);
		res.status(200).json({ message: "Profile updated successfully" });
	} catch (error) {
		logger.error(`Error updating user profile for id ${userId}:`, error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Supprimer le compte de l'utilisateur
exports.deleteAccount = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await Users.findByPk(userId);

		if (!user) {
			logger.warn(`User not found with id: ${userId}`);
			return res.status(404).json({ error: "User not found" });
		}

		await user.destroy();

		logger.info(`User account deleted successfully for id: ${userId}`);
		res.status(200).json({ message: "Account deleted successfully" });
	} catch (error) {
		logger.error(`Error deleting user account for id ${userId}:`, error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Total d'USER
exports.getTotalStudents = async (req, res) => {
	try {
		const totalStudents = await Users.count();
		logger.info(
			`Total students count retrieved successfully: ${totalStudents}`
		);
		res.status(200).json({ count: totalStudents });
	} catch (error) {
		logger.error("Error retrieving total students:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
