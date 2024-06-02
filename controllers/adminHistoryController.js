const { Users, AdminHistories } = require("../models");

exports.createUser = async (req, res) => {
	try {
		const user = await Users.create(req.body);
		await AdminHistories.create({
			action: "create",
			affectedData: user.toJSON(),
			adminId: req.user.id,
			targetUserId: user.id,
		});
		res.status(201).json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const user = await Users.findByPk(req.params.id);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}
		const oldUserData = user.toJSON();
		await user.update(req.body);
		await AdminHistories.create({
			action: "update",
			affectedData: { old: oldUserData, new: user.toJSON() },
			adminId: req.user.id,
			targetUserId: user.id,
		});
		res.json(user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;

		const user = await Users.findByPk(userId);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Enregistrer les données de l'utilisateur avant de le supprimer
		const deletedUserData = user.toJSON();

		// Enregistrer l'action de suppression dans l'historique de l'administrateur
		await AdminHistories.create({
			action: "delete",
			affectedData: deletedUserData,
			adminId: req.user.id,
			targetUserId: deletedUserData.id,
		});

		await user.destroy();

		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Server error" });
	}
};
