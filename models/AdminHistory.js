// models/adminHistory.js
module.exports = (sequelize, DataTypes) => {
	const AdminHistory = sequelize.define("AdminHistory", {
		action: {
			type: DataTypes.ENUM("view", "update", "delete"),
			allowNull: false,
		},
		affectedData: {
			type: DataTypes.JSON,
			allowNull: false,
		},
		timestamp: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	});

	AdminHistory.associate = (models) => {
		AdminHistory.belongsTo(models.Users, {
			foreignKey: {
				name: "adminId",
				allowNull: false,
			},
		});
		AdminHistory.belongsTo(models.Users, {
			foreignKey: {
				name: "targetUserId",
				allowNull: false,
			},
		});
	};

	return AdminHistory;
};
