const express = require("express");
const router = express.Router();
const tripController = require("../controllers/tripController");
const authMiddleware = require("../middlewares/authMiddleware");

// Route pour récuperer tous les trajets
router.get("/", authMiddleware, tripController.getAllTrips);

// Route pour créer un nouveau trajet
router.post("/", authMiddleware, tripController.createTrip);

// Route pour récupérer tous les trajets d'un utilisateur en tant que conducteur
router.get("/user/driver", authMiddleware, tripController.getUserTripsAsDriver);

// Route pour récupérer tous les trajets d'un utilisateur en tant que passager
router.get(
	"/user/passenger",
	authMiddleware,
	tripController.getUserTripsAsPassenger
);

// Route pour récupérer les détails d'un trajet spécifique
router.get("/:id", authMiddleware, tripController.getTripById);

// Route pour mettre à jour les informations d'un trajet
router.put("/:id", authMiddleware, tripController.updateTrip);

// Route pour supprimer un trajet
router.delete("/:id", authMiddleware, tripController.deleteTrip);

// Route pour rechercher des trajets en fonction de critères
router.get("/search", authMiddleware, tripController.searchTrips);

router.post("/:id/join", authMiddleware, tripController.joinTrip);

router.delete("/:tripId/leave", authMiddleware, tripController.leaveTrip);

module.exports = router;
