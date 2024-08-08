const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messageController");
const authMiddleware = require("../middlewares/authMiddleware");

// Créer un nouveau message
router.post("/:tripId", authMiddleware, messageController.createMessage);

// Récupérer tous les messages d'un trip
router.get("/:tripId", authMiddleware, messageController.getMessagesByTrip);

module.exports = router;
