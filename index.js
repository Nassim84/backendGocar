const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const { sequelize } = require("./models");
const logger = require("./utils/logger");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

// Middleware
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging pour les requêtes
app.use((req, res, next) => {
	logger.info(`${req.method} ${req.url}`);
	next();
});

// Importation des routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const tripRoutes = require("./routes/tripRoutes");
const messageRoutes = require("./routes/messageRoutes");
const AdminHistoriesRoutes = require("./routes/adminHistoryRoutes");

// Utilisation des routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/admin-history", AdminHistoriesRoutes);

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
	logger.error(err.stack);
	res.status(500).send("Something broke!");
});

// Gérer les connexions Socket.IO
io.on("connection", (socket) => {
	console.log("Un nouveau client est connecté");

	// Écoutez les événements émis par le client
	socket.on("sendMessage", (data) => {
		// Logique de traitement du message reçu
		// ...

		// Diffusez le message aux autres clients connectés
		socket.broadcast.emit("receiveMessage", data);
	});

	socket.on("disconnect", () => {
		console.log("Un client s'est déconnecté");
	});
});

// Synchronisation de la base de données et démarrage du serveur
sequelize
	.sync()
	.then(() => {
		logger.info("Database synced successfully");
		server.listen(3000, () => {
			logger.info("Server is running on port 3000");
		});
	})
	.catch((error) => {
		logger.error("Error syncing database:", error);
	});

module.exports = app;
