import request from "supertest";
import app from "../src/index"; // Utilise l'app réelle

describe("Integration tests for Justify API", () => {
    let token: string;

    beforeAll(async () => {
        // Générer un token pour les tests
        const res = await request(app)
            .post("/api/token")
            .send({ email: "test@example.com" });

        expect(res.status).toBe(200);
        expect(res.body.token).toBeDefined();
        token = res.body.token;
    });

    it("should return 401 if no token is provided", async () => {
        const res = await request(app)
            .post("/api/justify")
            .set("Content-Type", "text/plain")
            .send("Hello world");

        expect(res.status).toBe(401);
        expect(res.body.error).toBe("Missing token");
    });

    it("should return 400 if the body is empty", async () => {
        const res = await request(app)
            .post("/api/justify")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "text/plain")
            .send("");

        expect(res.status).toBe(400);
        expect(res.body.error).toBeDefined();
    });

    it("should justify text correctly when valid token is provided", async () => {
        const input = "Lorem ipsum dolor sit amet consectetur adipiscing elit";
        const res = await request(app)
            .post("/api/justify")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "text/plain")
            .send(input);

        expect(res.status).toBe(200);
        expect(res.text).toContain("Lorem");
        expect(res.text).toContain("ipsum");

        // Vérifie que chaque ligne sauf la dernière a la longueur max 80
        const lines = res.text.split("\n");
        for (let i = 0; i < lines.length - 1; i++) {
            expect(lines[i].length).toBe(80);
        }
    });

    it("should justify a longer text into multiple lines", async () => {
        const input = "This is a longer text meant to test the justify API. Each line should have words distributed evenly to fill 80 characters.";
        const res = await request(app)
            .post("/api/justify")
            .set("Authorization", `Bearer ${token}`)
            .set("Content-Type", "text/plain")
            .send(input);

        expect(res.status).toBe(200);
        const lines = res.text.split("\n");
        // Vérifie la longueur des lignes sauf la dernière
        for (let i = 0; i < lines.length - 1; i++) {
            expect(lines[i].length).toBe(80);
        }
    });
});
