require("dotenv").config();

module.exports = {
	development: {
		username: process.env.DB_USERNAME || "root",
		password: process.env.DB_PASSWORD || "hvqSpNRnsNFVfnOf",
		database: process.env.DB_DATABASE || "gocar",
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || 3306,
		dialect: "mysql",
	},
	test: {
		username: process.env.DB_USERNAME || "root",
		password: process.env.DB_PASSWORD || "hvqSpNRnsNFVfnOf",
		database: process.env.DB_DATABASE_TEST || "gocar_test",
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || 3306,
		dialect: "mysql",
	},
	production: {
		username: process.env.DB_USERNAME || "root",
		password: process.env.DB_PASSWORD || "hvqSpNRnsNFVfnOf",
		database: process.env.DB_DATABASE_PROD || "database_production",
		host: process.env.DB_HOST || "localhost",
		port: process.env.DB_PORT || 3306,
		dialect: "mysql",
	},
};
