// models/vehicles.js
module.exports = (sequelize, DataTypes) => {
	const Vehicles = sequelize.define("Vehicles", {
		brand: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		model: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		color: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		numberOfSeats: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});

	Vehicles.associate = (models) => {
		Vehicles.belongsTo(models.Users, {
			foreignKey: {
				name: "userId",
				allowNull: false,
			},
		});
	};

	return Vehicles;
};
