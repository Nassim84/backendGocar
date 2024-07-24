const express = require("express");
const { body } = require("express-validator");
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const logger = require("../utils/logger");

const router = express.Router();

// Route pour récupérer tous les profils
router.get("/profiles", userController.getProfiles);

// Route pour récupérer le nomùbre d'utilsiateur
router.get("/count", userController.getTotalStudents);

// Route pour récupérer le profil de l'utilisateur
router.get("/profile", authMiddleware, userController.getProfile);

// Route pour mettre à jour le profil de l'utilisateur
router.put("/profile", authMiddleware, userController.updateProfile);

// Route pour mettre à jour le mot de passe de l'utilisateur
router.put(
	"/change-password",
	authMiddleware,
	[
		body("currentPassword")
			.notEmpty()
			.withMessage("Current password is required"),
		body("newPassword")
			.isLength({ min: 8 })
			.withMessage("New password must be at least 8 characters long")
			.matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
			.withMessage(
				"New password must contain at least one uppercase letter, one lowercase letter, and one number"
			),
	],
	userController.changePassword
);

// Route pour supprimer le compte de l'utilisateur
router.delete("/profile", authMiddleware, userController.deleteAccount);

module.exports = router;
