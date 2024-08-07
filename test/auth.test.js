const request = require("supertest");
const app = require("../index");
const { sequelize, Users } = require("../models");
const bcrypt = require("bcrypt");

describe("Authentication", () => {
	beforeAll(async () => {
		await sequelize.sync({ force: true });
	});

	afterAll(async () => {
		await sequelize.close();
	});

	afterEach(async () => {
		await Users.destroy({ where: {} });
	});

	describe("Register", () => {
		it("should register a new user with valid data", async () => {
			const res = await request(app).post("/api/auth/register").send({
				name: "John",
				firstname: "Doe",
				email: "john.doe@example.com",
				password: "Password123",
				role: "student",
				campus: "Avignon",
			});

			expect(res.status).toBe(201);
			expect(res.body).toHaveProperty(
				"message",
				"User registered successfully"
			);

			const user = await Users.findOne({
				where: { email: "john.doe@example.com" },
			});
			expect(user).not.toBeNull();
			expect(user.name).toBe("John");
			expect(user.firstname).toBe("Doe");
			expect(user.role).toBe("student");
			expect(user.campus).toBe("Avignon");
		});

		it("should not register a user with invalid data", async () => {
			const res = await request(app).post("/api/auth/register").send({
				name: "",
				firstname: "Doe",
				email: "invalid-email",
				password: "short",
				role: "invalid-role",
				campus: "invalid-campus",
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty("errors");
		});

		it("should not register a user with an existing email", async () => {
			await Users.create({
				name: "John",
				firstname: "Doe",
				email: "john.doe@example.com",
				password: await bcrypt.hash("Password123", 10),
				role: "student",
				campus: "Avignon",
			});

			const res = await request(app).post("/api/auth/register").send({
				name: "John",
				firstname: "Doe",
				email: "john.doe@example.com",
				password: "Password123",
				role: "student",
				campus: "Avignon",
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty("error", "Email already exists");
		});
	});

	describe("Login", () => {
		it("should login a user with valid credentials", async () => {
			const hashedPassword = await bcrypt.hash("Password123", 10);
			await Users.create({
				name: "John",
				firstname: "Doe",
				email: "john.doe@example.com",
				password: hashedPassword,
				role: "student",
				campus: "Avignon",
			});

			const res = await request(app).post("/api/auth/login").send({
				email: "john.doe@example.com",
				password: "Password123",
			});

			expect(res.status).toBe(200);
			expect(res.body).toHaveProperty("token");
			expect(res.body).toHaveProperty("role", "student");
		});

		it("should not login a user with invalid credentials", async () => {
			const res = await request(app).post("/api/auth/login").send({
				email: "john.doe@example.com",
				password: "wrong-password",
			});

			expect(res.status).toBe(400);
			expect(res.body).toHaveProperty("error", "Invalid email or password");
		});
	});
});
