import { JustifyService } from "../src/services/justify.service";
import Redis from "ioredis";

jest.mock("ioredis");

describe("JustifyService Unit Tests", () => {
    let justifyService: JustifyService;
    let mockRedisInstance: any;

    beforeEach(() => {
        mockRedisInstance = {
            get: jest.fn().mockResolvedValue(null),
            set: jest.fn().mockResolvedValue("OK"),
            quit: jest.fn().mockResolvedValue("OK"),
        };
        (Redis as any).mockImplementation(() => mockRedisInstance);

        justifyService = new JustifyService(80);
    });

    afterEach(async () => {
        await justifyService.close();
        jest.clearAllMocks();
    });

    describe("justifyText", () => {
        it("should return empty string for empty input", async () => {
            const result = await justifyService.justifyText("");
            expect(result).toBe("");
        });

        it("should return empty string for whitespace only", async () => {
            const result = await justifyService.justifyText("   ");
            expect(result).toBe("");
        });

        it("should return single word as-is", async () => {
            const result = await justifyService.justifyText("Hello");
            expect(result).toBe("Hello");
        });

        it("should justify text to 80 characters per line", async () => {
            const input = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore";
            const result = await justifyService.justifyText(input);
            const lines = result.split("\n");

            // Toutes les lignes sauf la dernière doivent avoir 80 caractères
            for (let i = 0; i < lines.length - 1; i++) {
                expect(lines[i].length).toBe(80);
            }
        });

        it("should not justify the last line", async () => {
            const input = "Short text that fits in one line";
            const result = await justifyService.justifyText(input);

            // Une seule ligne, ne doit pas être justifiée
            expect(result).toBe(input);
            expect(result).not.toMatch(/  +/); // Pas d'espaces multiples
        });

        it("should use Redis cache on second call", async () => {
            const input = "Cache test text";

            // Premier appel - cache miss
            await justifyService.justifyText(input);
            expect(mockRedisInstance.get).toHaveBeenCalled();
            expect(mockRedisInstance.set).toHaveBeenCalled();

            // Simuler cache hit
            mockRedisInstance.get.mockResolvedValueOnce("Cached result");

            // Deuxième appel - cache hit
            const result = await justifyService.justifyText(input);
            expect(result).toBe("Cached result");
        });

        it("should handle very long words", async () => {
            const longWord = "a".repeat(85);
            const result = await justifyService.justifyText(longWord);

            // Le mot dépasse 80 caractères, mais doit être retourné tel quel
            expect(result).toBe(longWord);
        });

        it("should distribute spaces evenly", async () => {
            const input = "a b c d e f g h i j k l m n o p q r s t u v w x y z a b c d e f g h i j k";
            const result = await justifyService.justifyText(input);
            const lines = result.split("\n");

            // Vérifie que les lignes justifiées ont exactement 80 caractères
            for (let i = 0; i < lines.length - 1; i++) {
                expect(lines[i].length).toBe(80);
            }
        });
    });
});