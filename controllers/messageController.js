const { Messages, Users } = require("../models");
const { io } = require("../index");
const logger = require("../utils/logger");

exports.createMessage = async (req, res) => {
	try {
		const { content } = req.body;
		const senderId = req.userId;
		const tripId = req.params.tripId;

		const message = await Messages.create({ content, senderId, tripId });

		// Diffusez le nouveau message aux clients connectés
		if (io) {
			io.emit("newMessage", message);
			logger.info(`New message created for trip ${tripId} by user ${senderId}`);
		} else {
			logger.error("Socket.IO is not configured correctly.");
		}

		res.status(201).json(message);
	} catch (error) {
		logger.error(
			`Error creating message for trip ${tripId} by user ${senderId}:`,
			error
		);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.getMessagesByTrip = async (req, res) => {
	try {
		const tripId = req.params.tripId;

		const messages = await Messages.findAll({
			where: { tripId },
			include: {
				model: Users,
				attributes: ["id", "name", "firstname"],
			},
		});

		logger.info(`Retrieved messages for trip ${tripId}`);
		res.status(200).json(messages);
	} catch (error) {
		logger.error(`Error retrieving messages for trip ${tripId}:`, error);
		res.status(500).json({ error: "Internal server error" });
	}
};
