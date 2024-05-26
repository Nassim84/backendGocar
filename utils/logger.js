const { createLogger, format, transports } = require("winston");
const { combine, timestamp, label, printf } = format;
const path = require("path");

const logFormat = printf(({ level, message, label, timestamp }) => {
	return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
	format: combine(label({ label: "my-app" }), timestamp(), logFormat),
	transports: [
		new transports.Console(),
		new transports.File({
			filename: path.join(__dirname, "../logs/error.log"),
			level: "error",
		}),
		new transports.File({
			filename: path.join(__dirname, "../logs/combined.log"),
		}),
	],
});

module.exports = logger;
