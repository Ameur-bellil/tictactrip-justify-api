import request from "supertest";
import express from "express";
import authRouter from "../src/routes/auth.route";

const app = express();
app.use(express.json());
app.use("/api", authRouter);

describe("Auth API", () => {
    it("should return a token when email is valid", async () => {
        const response = await request(app)
            .post("/api/token")
            .send({ email: "test@example.com" });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("token");
        expect(typeof response.body.token).toBe("string");
    });

    it("should return 400 when email is missing", async () => {
        const response = await request(app)
            .post("/api/token")
            .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("error");
    });
});
