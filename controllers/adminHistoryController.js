const crypto = require("crypto");
const bcrypt = require("bcrypt");
const { Users, AdminHistories } = require("../models");
const sendPasswordEmail = require("../utils/email");

function generatePassword() {
	const length = 8;
	const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
	const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const numberChars = "0123456789";
	let password = "";

	password += lowercaseChars.charAt(crypto.randomInt(0, lowercaseChars.length));
	password += uppercaseChars.charAt(crypto.randomInt(0, uppercaseChars.length));
	password += numberChars.charAt(crypto.randomInt(0, numberChars.length));

	const allChars = lowercaseChars + uppercaseChars + numberChars;
	for (let i = 3; i < length; i++) {
		password += allChars.charAt(crypto.randomInt(0, allChars.length));
	}

	password = password
		.split("")
		.sort(() => 0.5 - crypto.randomInt(0, 2))
		.join("");

	return password;
}

exports.createUser = async (req, res) => {
	try {
		// Générer un mot de passe aléatoire
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

		const deletedUserData = user.toJSON();

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
