const { Trips, Users, UserTrips } = require("../models");
const { Op } = require("sequelize");

// Créer un nouveau trajet
exports.createTrip = async (req, res) => {
	try {
		const {
			startLocation,
			endLocation,
			departureDateTime,
			recurrence,
			recurringDays,
			availableSeats,
		} = req.body;
		const driverId = req.userId;

		const trip = await Trips.create({
			startLocation,
			endLocation,
			departureDateTime,
			recurrence,
			recurringDays,
			availableSeats,
		});

		await UserTrips.create({ userId: driverId, tripId: trip.id, driverId });

		res.status(201).json(trip);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Récupérer tous les trajets d'un utilisateur en tant que conducteur
exports.getUserTripsAsDriver = async (req, res) => {
	try {
		const userId = req.userId;
		const trips = await Trips.findAll({
			include: {
				model: Users,
				as: "passengers", // Spécifiez l'alias ici
				where: { id: userId },
				through: {
					model: UserTrips,
					attributes: [],
				},
			},
		});
		res.status(200).json(trips);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Récupérer tous les trajets d'un utilisateur en tant que passager
exports.getUserTripsAsPassenger = async (req, res) => {
	try {
		const userId = req.userId;
		const user = await Users.findByPk(userId, {
			include: {
				model: Trips,
				as: "tripsAsPassenger", // Utilisez l'alias défini dans le modèle Users
				through: {
					model: UserTrips,
					attributes: [],
				},
			},
		});
		res.status(200).json(user.tripsAsPassenger);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Récupérer les détails d'un trajet spécifique
exports.getTripById = async (req, res) => {
	try {
		const tripId = req.params.id;

		const trip = await Trips.findOne({
			where: { id: tripId },
			include: [
				{
					model: Users,
					as: "passengers",
					attributes: ["id", "name", "firstname"],
					through: {
						model: UserTrips,
						attributes: [],
					},
				},
			],
		});

		if (!trip) {
			return res.status(404).json({ error: "Trip not found" });
		}

		res.status(200).json(trip);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Mettre à jour les informations d'un trajet
exports.updateTrip = async (req, res) => {
	try {
		const tripId = req.params.id;
		const userId = req.userId;
		const {
			startLocation,
			endLocation,
			departureDateTime,
			recurrence,
			recurringDays,
			availableSeats,
		} = req.body;

		const trip = await Trips.findOne({
			where: { id: tripId },
			include: {
				model: Users,
				as: "passengers",
				where: { id: userId },
				through: {
					model: UserTrips,
					attributes: [],
				},
			},
		});

		if (!trip) {
			return res.status(404).json({ error: "Trip not found" });
		}

		trip.startLocation = startLocation || trip.startLocation;
		trip.endLocation = endLocation || trip.endLocation;
		trip.departureDateTime = departureDateTime || trip.departureDateTime;
		trip.recurrence = recurrence || trip.recurrence;
		trip.recurringDays = recurringDays || trip.recurringDays;
		trip.availableSeats = availableSeats || trip.availableSeats;

		await trip.save();
		res.status(200).json(trip);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Supprimer un trajet
exports.deleteTrip = async (req, res) => {
	try {
		const tripId = req.params.id;
		const userId = req.userId;

		const trip = await Trips.findOne({
			where: { id: tripId },
			include: {
				model: Users,
				where: { id: userId },
				through: {
					model: UserTrips,
					attributes: [],
				},
				as: "passengers",
			},
		});
		if (!trip) {
			return res.status(404).json({ error: "Trip not found" });
		}

		await trip.destroy();
		res.status(200).json({ message: "Trip deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

// Rechercher des trajets en fonction de critères
exports.searchTrips = async (req, res) => {
	try {
		const { startLocation, endLocation, departureDate } = req.query;

		const trips = await Trips.findAll({
			where: {
				startLocation: { [Op.iLike]: `%${startLocation}%` },
				endLocation: { [Op.iLike]: `%${endLocation}%` },
				departureDateTime: { [Op.gte]: departureDate },
			},
			include: {
				model: Users,
				as: "driver",
				attributes: ["id", "name", "firstname"],
			},
		});

		res.status(200).json(trips);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.joinTrip = async (req, res) => {
	try {
		const userId = req.userId;
		const tripId = req.params.id;

		// Vérifier si le trajet existe
		const trip = await Trips.findByPk(tripId);
		if (!trip) {
			return res.status(404).json({ error: "Trip not found" });
		}

		// Vérifier si l'utilisateur est déjà inscrit au trajet
		const existingUserTrip = await UserTrips.findOne({
			where: { userId, tripId },
		});
		if (existingUserTrip) {
			return res.status(400).json({ error: "User already joined the trip" });
		}
		if (trip.driverId === userId) {
			return res
				.status(400)
				.json({ error: "Driver cannot join their own trip as a passenger" });
		}

		// Vérifier si des places sont disponibles
		if (trip.availableSeats === 0) {
			return res
				.status(400)
				.json({ error: "No available seats for this trip" });
		}

		// Inscrire l'utilisateur au trajet et décrementer le nombre de places disponibles
		await UserTrips.create({ userId, tripId });
		trip.availableSeats--;
		await trip.save();

		res.status(200).json({ message: "User successfully joined the trip" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

exports.leaveTrip = async (req, res) => {
	try {
		const userId = req.userId;
		const tripId = req.params.tripId;

		// Vérifier si l'utilisateur est inscrit au trajet
		const userTrip = await UserTrips.findOne({ where: { userId, tripId } });
		if (!userTrip) {
			return res.status(400).json({ error: "User is not joined to this trip" });
		}

		// Supprimer l'inscription de l'utilisateur pour ce trajet
		await userTrip.destroy();

		// Incrémenter le nombre de places disponibles pour le trajet
		const trip = await Trips.findByPk(tripId);
		trip.availableSeats++;
		await trip.save();

		res.status(200).json({ message: "User successfully left the trip" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
