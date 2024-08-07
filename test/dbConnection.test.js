// const { sequelize } = require("../models"); // Assure-toi que le chemin est correct

const { Sequelize } = require("sequelize");
const config = require("../config/config.json")["test"];

describe("Database Connection", () => {
	it("should connect to the database successfully", async () => {
		try {
			const sequelize = new Sequelize(
				config.database,
				config.username,
				config.password,
				config
			);
			await sequelize.authenticate();
			expect(true).toBe(true);
		} catch (error) {
			expect(error).toBeNull();
		}
	});
});
