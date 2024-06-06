require("dotenv").config();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Users, AdminHistories } = require("../models");
const sendPasswordEmail = require("../utils/email");
const { generatePassword } = require("../utils/passwordUtils");
const logger = require("../utils/logger");

exports.createUser = async (req, res) => {
	try {
		const password = generatePassword();
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const user = await Users.create({ ...req.body, password: hashedPassword });

		await AdminHistories.create({
			action: "create",
			affectedData: user.toJSON(),
			adminId: req.user.id,
			targetUserId: user.id,
		});

		await sendPasswordEmail(req.body.email, password);

		logger.info(`New user created with id ${user.id} by admin ${req.user.id}`);
		res.status(201).json(user);
	} catch (error) {
		logger.error(`Error creating user by admin ${req.user.id}:`, error);
		res.status(500).json({ error: "Server error" });
	}
};

exports.updateUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await Users.findByPk(userId);

		if (!user) {
			logger.warn(
				`User not found with id ${userId} for update by admin ${req.user.id}`
			);
			return res.status(404).json({ error: "User not found" });
		}

		const oldUserData = user.toJSON();
		await user.update(req.body);

		await AdminHistories.create({
			action: "update",
			affectedData: { old: oldUserData, new: user.toJSON() },
			adminId: req.user.id,
			targetUserId: userId,
		});

		logger.info(`User updated with id ${userId} by admin ${req.user.id}`);
		res.json(user);
	} catch (error) {
		logger.error(
			`Error updating user with id ${userId} by admin ${req.user.id}:`,
			error
		);
		res.status(500).json({ error: "Server error" });
	}
};

exports.deleteUser = async (req, res) => {
	try {
		const userId = req.params.id;
		const user = await Users.findByPk(userId);

		if (!user) {
			logger.warn(
				`User not found with id ${userId} for deletion by admin ${req.user.id}`
			);
			return res.status(404).json({ error: "User not found" });
		}

		const deletedUserData = user.toJSON();

		await AdminHistories.create({
			action: "delete",
			affectedData: deletedUserData,
			adminId: req.user.id,
			targetUserId: deletedUserData.id,
		});

		await user.destroy();

		logger.info(`User deleted with id ${userId} by admin ${req.user.id}`);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		logger.error(
			`Error deleting user with id ${userId} by admin ${req.user.id}:`,
			error
		);
		res.status(500).json({ error: "Server error" });
	}
};
