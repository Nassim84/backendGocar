const { Users } = require("../models");

exports.getProfiles = async (req, res) => {
	try {
		const users = await Users.findAll();
		res.json(users);
	} catch (error) {
		res.status(500).json({ error: error.message });
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
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user);
	} catch (error) {
		console.error(error);
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
			return res.status(404).json({ error: "User not found" });
		}

		user.name = name || user.name;
		user.firstname = firstname || user.firstname;
		user.email = email || user.email;
		user.campus = campus || user.campus;

		await user.save();

		res.status(200).json({ message: "Profile updated successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Supprimer le compte de l'utilisateur
exports.deleteAccount = async (req, res) => {
	try {
		const userId = req.userId;

		const user = await Users.findByPk(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		await user.destroy();

		res.status(200).json({ message: "Account deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Total d'USER

exports.getTotalStudents = async (req, res) => {
	try {
		const totalStudents = await Users.count();
		res.status(200).json({ count: totalStudents });
	} catch (error) {
		console.error("Error retrieving total students:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};
