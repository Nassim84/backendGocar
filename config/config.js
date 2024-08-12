require("dotenv").config();

module.exports = {
	development: {
		username: process.env.PROD_DB_USERNAME,
		password: process.env.PROD_DB_PASSWORD,
		database: process.env.PROD_DB_DATABASE,
		host: process.env.PROD_DB_HOST,
		port: process.env.PROD_DB_PORT || 3306,
		dialect: "mysql",
	},
	test: {
		username: process.env.DEV_DB_USERNAME,
		password: process.env.DEV_DB_PASSWORD,
		database: process.env.DB_DATABASE_TEST,
		host: process.env.DEV_DB_HOST,
		port: process.env.DEV_DB_PORT || 3306,
		dialect: "mysql",
	},
	production: {
		username: process.env.PROD_DB_USERNAME,
		password: process.env.PROD_DB_PASSWORD,
		database: process.env.PROD_DB_DATABASE,
		host: process.env.PROD_DB_HOST,
		port: process.env.PROD_DB_PORT || 3306,
		dialect: "mysql",
	},
};
