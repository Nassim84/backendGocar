module.exports = (sequelize, DataTypes) => {
	const Users = sequelize.define("Users", {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		firstname: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true,
			validate: {
				isEmail: true,
			},
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM("student", "admin"),
			allowNull: false,
			defaultValue: "student",
		},
		campus: {
			type: DataTypes.ENUM("Avignon", "Pertuis"),
			allowNull: false,
		},
		registrationDate: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	});

	Users.associate = (models) => {
		Users.belongsToMany(models.Trips, {
			through: "UserTrips",
			foreignKey: "userId",
			as: "tripsAsDriver", // Alias pour les trajets en tant que conducteur
		});

		Users.belongsToMany(models.Trips, {
			through: "UserTrips",
			foreignKey: "userId",
			as: "tripsAsPassenger", // Alias pour les trajets en tant que passager
		});
	};

	return Users;
};
