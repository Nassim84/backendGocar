const { Messages, User } = require("../models");
const { io } = require("../index"); // Importez l'instance Socket.IO depuis index.js

exports.createMessage = async (req, res) => {
	try {
		const { content } = req.body;
		const senderId = req.userId;
		const tripId = req.params.tripId;

		const message = await Messages.create({ content, senderId, tripId });

		// Diffusez le nouveau message aux clients connectés
		if (io) {
			io.emit("newMessage", message);
		} else {
			console.log("Socket.IO is not configured correctly.");
		}
		res.status(201).json(message);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.getMessagesByTrip = async (req, res) => {
	try {
		const tripId = req.params.tripId;

		const messages = await Messages.findAll({
			where: { tripId },
		});

		res.status(200).json(messages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
