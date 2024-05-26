// models/messages.js
module.exports = (sequelize, DataTypes) => {
	const Messages = sequelize.define("Messages", {
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		sentAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	});

	Messages.associate = (models) => {
		Messages.belongsTo(models.Users, {
			foreignKey: {
				name: "senderId",
				allowNull: false,
			},
		});
		Messages.belongsTo(models.Trips, {
			foreignKey: {
				name: "tripId",
				allowNull: false,
			},
		});
	};

	return Messages;
};
