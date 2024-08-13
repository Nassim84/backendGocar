// tests/auth.test.js
const request = require("supertest");
const { sequelize, Users } = require("../models");
const app = require("../index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Avant chaque test, on réinitialise la base de données et on crée un utilisateur de test
beforeEach(async () => {
	await sequelize.sync({ force: true });

	const hashedPassword = await bcrypt.hash("password123", 10);

	await Users.create({
		name: "John",
		firstname: "Doe",
		email: "johndoe@example.com",
		password: hashedPassword,
		role: "student",
		campus: "Avignon",
	});
});

describe("Authentication Tests", () => {
	it("should authenticate user with valid credentials", async () => {
		const response = await request(app)
			.post("/api/auth/login") // Modifier cette route si elle est différente
			.send({
				email: "johndoe@example.com",
				password: "password123",
			});

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveProperty("token");
		expect(response.body).toHaveProperty("role", "student");

		// Vérifie que le token est valide
		const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
		expect(decoded).toHaveProperty("userId");
		expect(decoded).toHaveProperty("role", "student");
	});

	it("should reject invalid credentials", async () => {
		const response = await request(app)
			.post("/api/auth/login") // Modifier cette route si elle est différente
			.send({
				email: "johndoe@example.com",
				password: "wrongpassword",
			});

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty("error", "Invalid email or password");
	});

	it("should return 400 if email does not exist", async () => {
		const response = await request(app)
			.post("/api/auth/login") // Modifier cette route si elle est différente
			.send({
				email: "notexisting@example.com",
				password: "password123",
			});

		expect(response.statusCode).toBe(400);
		expect(response.body).toHaveProperty("error", "Invalid email or password");
	});
});
