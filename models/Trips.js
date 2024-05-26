// models/trips.js
module.exports = (sequelize, DataTypes) => {
	const Trips = sequelize.define("Trips", {
		startLocation: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		endLocation: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		departureDateTime: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		recurrence: {
			type: DataTypes.ENUM("unique", "weekly", "biweekly"),
			allowNull: false,
			defaultValue: "unique",
		},
		recurringDays: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		availableSeats: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM("open", "full", "cancelled"),
			allowNull: false,
			defaultValue: "open",
		},
	});

	Trips.associate = (models) => {
		Trips.belongsToMany(models.Users, {
			through: "UserTrips",
			foreignKey: "tripId",
			as: "passengers",
		});
	};

	return Trips;
};
