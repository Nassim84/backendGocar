module.exports = (sequelize, DataTypes) => {
	const AdminHistories = sequelize.define("AdminHistories", {
		action: {
			type: DataTypes.ENUM("create", "update", "delete"),
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

	AdminHistories.associate = (models) => {
		AdminHistories.belongsTo(models.Users, {
			foreignKey: {
				name: "adminId",
				allowNull: false,
			},
			onDelete: "RESTRICT",
		});
		AdminHistories.belongsTo(models.Users, {
			foreignKey: {
				name: "targetUserId",
				allowNull: true, // Autorise les valeurs NULL pour targetUserId
			},
			onDelete: "SET NULL",
		});
	};

	return AdminHistories;
};
