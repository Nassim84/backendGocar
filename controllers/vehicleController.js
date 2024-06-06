const { Vehicles } = require("../models");
const logger = require("../utils/logger");

// Ajouter un nouveau véhicule
exports.createVehicle = async (req, res) => {
	try {
		const { brand, model, color, numberOfSeats } = req.body;
		const userId = req.userId;

		const vehicle = await Vehicles.create({
			brand,
			model,
			color,
			numberOfSeats,
			userId,
		});

		logger.info(
			`New vehicle created successfully for user ${userId}: ${JSON.stringify(
				vehicle
			)}`
		);
		res.status(201).json(vehicle);
	} catch (error) {
		logger.error(`Error creating vehicle for user ${userId}:`, error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Récupérer tous les véhicules d'un utilisateur
exports.getUserVehicles = async (req, res) => {
	try {
		const userId = req.userId;
		const vehicles = await Vehicles.findAll({ where: { userId } });

		logger.info(`Retrieved user vehicles for user ${userId}`);
		res.status(200).json(vehicles);
	} catch (error) {
		logger.error(`Error retrieving user vehicles for user ${userId}:`, error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Récupérer les détails d'un véhicule spécifique
exports.getVehicleById = async (req, res) => {
	try {
		const vehicleId = req.params.id;
		const userId = req.userId;

		const vehicle = await Vehicles.findOne({
			where: { id: vehicleId, userId },
		});

		if (!vehicle) {
			logger.warn(`Vehicle not found with id ${vehicleId} for user ${userId}`);
			return res.status(404).json({ error: "Vehicle not found" });
		}

		logger.info(
			`Retrieved vehicle details for id ${vehicleId} and user ${userId}`
		);
		res.status(200).json(vehicle);
	} catch (error) {
		logger.error(
			`Error retrieving vehicle details for id ${vehicleId} and user ${userId}:`,
			error
		);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Mettre à jour les informations d'un véhicule
exports.updateVehicle = async (req, res) => {
	try {
		const vehicleId = req.params.id;
		const userId = req.userId;
		const { brand, model, color, numberOfSeats } = req.body;

		const vehicle = await Vehicles.findOne({
			where: { id: vehicleId, userId },
		});

		if (!vehicle) {
			logger.warn(`Vehicle not found with id ${vehicleId} for user ${userId}`);
			return res.status(404).json({ error: "Vehicle not found" });
		}

		vehicle.brand = brand || vehicle.brand;
		vehicle.model = model || vehicle.model;
		vehicle.color = color || vehicle.color;
		vehicle.numberOfSeats = numberOfSeats || vehicle.numberOfSeats;

		await vehicle.save();

		logger.info(
			`Vehicle updated successfully with id ${vehicleId} for user ${userId}`
		);
		res.status(200).json(vehicle);
	} catch (error) {
		logger.error(
			`Error updating vehicle with id ${vehicleId} for user ${userId}:`,
			error
		);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Supprimer un véhicule
exports.deleteVehicle = async (req, res) => {
	try {
		const vehicleId = req.params.id;
		const userId = req.userId;

		const vehicle = await Vehicles.findOne({
			where: { id: vehicleId, userId },
		});

		if (!vehicle) {
			logger.warn(`Vehicle not found with id ${vehicleId} for user ${userId}`);
			return res.status(404).json({ error: "Vehicle not found" });
		}

		await vehicle.destroy();

		logger.info(
			`Vehicle deleted successfully with id ${vehicleId} for user ${userId}`
		);
		res.status(200).json({ message: "Vehicle deleted successfully" });
	} catch (error) {
		logger.error(
			`Error deleting vehicle with id ${vehicleId} for user ${userId}:`,
			error
		);
		res.status(500).json({ error: "Internal server error" });
	}
};
