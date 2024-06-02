const { Users } = require("../models");

const adminAuthMiddleware = async (req, res, next) => {
	try {
		const user = await Users.findByPk(req.userId);
		if (!user) {
			return res.status(401).json({ error: "User not found" });
		}
		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Internal server error" });
	}
};

module.exports = adminAuthMiddleware;
