const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/profiles", userController.getProfiles);

router.get("/count", userController.getTotalStudents);

// Route pour récupérer le profil de l'utilisateur
router.get("/profile", authMiddleware, userController.getProfile);

// Route pour mettre à jour le profil de l'utilisateur
router.put("/profile", authMiddleware, userController.updateProfile);

// Route pour supprimer le compte de l'utilisateur
router.delete("/profile", authMiddleware, userController.deleteAccount);

module.exports = router;
