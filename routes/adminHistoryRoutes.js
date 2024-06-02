const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminHistoryController");
const authMiddleware = require("../middlewares/authMiddleware");
const adminAuthMiddleware = require("../middlewares/adminAuthMiddleware");
const adminMiddleware = require("../middlewares/admin");

router.post(
	"/users",
	authMiddleware,
	adminAuthMiddleware,
	adminMiddleware,
	adminController.createUser
);
router.put(
	"/users/:id",
	authMiddleware,
	adminAuthMiddleware,
	adminMiddleware,
	adminController.updateUser
);
router.delete(
	"/users/:id",
	authMiddleware,
	adminAuthMiddleware,
	adminMiddleware,
	adminController.deleteUser
);

module.exports = router;
