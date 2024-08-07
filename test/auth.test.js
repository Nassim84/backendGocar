// tests/auth.test.js
const request = require("supertest");
const { sequelize, Users } = require("../models");
const app = require("../index");

describe("Auth API", () => {
	beforeAll(async () => {
		await sequelize.sync({ force: true }); // Remettre la base de données à zéro avant les tests
	});

	afterAll(async () => {
		await sequelize.close(); // Fermer la connexion à la base de données après les tests
	});

	describe("POST /api/auth/register", () => {
		it("should register a new user", async () => {
			const response = await request(app).post("/api/auth/register").send({
				name: "John",
				firstname: "Doe",
				email: "john.doe@example.com",
				password: "Password123",
				role: "student",
				campus: "Avignon",
			});

			expect(response.statusCode).toBe(201);
			expect(response.body.message).toBe("User registered successfully");
		});

		it("should not register a user with an existing email", async () => {
			const response = await request(app).post("/api/auth/register").send({
				name: "John",
				firstname: "Doe",
				email: "john.doe@example.com", // Same email as previous test
				password: "Password123",
				role: "student",
				campus: "Avignon",
			});

			expect(response.statusCode).toBe(400);
			expect(response.body.error).toBe("Email already exists");
		});
	});

	describe("POST /api/auth/login", () => {
		it("should log in an existing user", async () => {
			const response = await request(app).post("/api/auth/login").send({
				email: "john.doe@example.com",
				password: "Password123",
			});

			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty("token");
			expect(response.body.role).toBe("student");
		});

		it("should not log in with invalid credentials", async () => {
			const response = await request(app).post("/api/auth/login").send({
				email: "john.doe@example.com",
				password: "wrongpassword",
			});

			expect(response.statusCode).toBe(400);
			expect(response.body.error).toBe("Invalid email or password");
		});
	});
});
