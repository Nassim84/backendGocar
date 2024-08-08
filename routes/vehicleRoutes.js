const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicleController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route pour ajouter un nouveau véhicule
router.post("/", authMiddleware, vehicleController.createVehicle);

// Route pour récupérer tous les véhicules d'un utilisateur
router.get("/", authMiddleware, vehicleController.getUserVehicles);

// Route pour récupérer les détails d'un véhicule spécifique
router.get("/:id", authMiddleware, vehicleController.getVehicleById);

// Route pour mettre à jour les informations d'un véhicule
router.put("/:id", authMiddleware, vehicleController.updateVehicle);

// Route pour supprimer un véhicule
router.delete("/:id", authMiddleware, vehicleController.deleteVehicle);

module.exports = router;
