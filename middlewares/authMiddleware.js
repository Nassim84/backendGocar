const jwt = require("jsonwebtoken");
const logger = require("../utils/logger"); // Import du logger
require("dotenv").config();

const authMiddleware = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		logger.warn("Authorization header missing");
		return res.status(401).json({ error: "Authorization header missing" });
	}

	const token = authHeader.split(" ")[1];

	if (!token) {
		logger.warn("Authorization token missing");
		return res.status(401).json({ error: "Authorization token missing" });
	}

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
		req.userId = decodedToken.userId;
		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			logger.warn("Token expired");
			res.status(401).json({ error: "Token expired" });
		} else if (error.name === "JsonWebTokenError") {
			logger.warn("Invalid token");
			res.status(401).json({ error: "Invalid token" });
		} else {
			logger.error(`Token verification error: ${error.message}`);
			res.status(500).json({ error: "Internal server error" });
		}
	}
};

module.exports = authMiddleware;
