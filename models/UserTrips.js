// models/userTrips.js
module.exports = (sequelize, DataTypes) => {
	const UserTrips = sequelize.define("UserTrips", {
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Users",
				key: "id",
			},
		},
		tripId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: "Trips",
				key: "id",
			},
		},
	});

	return UserTrips;
};
