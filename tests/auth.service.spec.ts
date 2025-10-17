import { AuthService } from "../src/services/auth.service";
import { UserRepo } from "../src/repositories/user.repo";
import jwt from "jsonwebtoken";

// Mock des dépendances
jest.mock("../src/repositories/user.repo");
jest.mock("jsonwebtoken");
jest.mock("../src/config/env", () => ({
    env: {
        JWT_SECRET: "test-secret"
    }
}));

describe("AuthService", () => {
    let authService: AuthService;
    let mockUserRepo: jest.Mocked<UserRepo>;

    beforeEach(() => {
        // Réinitialiser les mocks
        jest.clearAllMocks();

        // Créer un mock du repository
        mockUserRepo = {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            resetDailyLimit: jest.fn(),
        } as any;

        authService = new AuthService(mockUserRepo);
    });

    describe("generateToken", () => {
        it("should return a token when user exists", async () => {
            const email = "test@example.com";
            const mockUser = { email, totalWords: 0 };

            mockUserRepo.findByEmail.mockResolvedValue(mockUser as any);
            (jwt.sign as jest.Mock).mockReturnValue("mock-token");

            const token = await authService.generateToken(email);

            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepo.createUser).not.toHaveBeenCalled();
            expect(jwt.sign).toHaveBeenCalledWith({ email }, "test-secret");
            expect(token).toBe("mock-token");
        });

        it("should create user and return token when user does not exist", async () => {
            const email = "new@example.com";
            const mockNewUser = { email, totalWords: 0 };

            mockUserRepo.findByEmail.mockResolvedValue(null);
            mockUserRepo.createUser.mockResolvedValue(mockNewUser as any);
            (jwt.sign as jest.Mock).mockReturnValue("mock-token");

            const token = await authService.generateToken(email);

            expect(mockUserRepo.findByEmail).toHaveBeenCalledWith(email);
            expect(mockUserRepo.createUser).toHaveBeenCalledWith(email);
            expect(jwt.sign).toHaveBeenCalledWith({ email }, "test-secret");
            expect(token).toBe("mock-token");
        });

        it("should return a valid string token", async () => {
            const email = "test@example.com";
            mockUserRepo.findByEmail.mockResolvedValue({ email } as any);
            (jwt.sign as jest.Mock).mockReturnValue("valid-jwt-token");

            const token = await authService.generateToken(email);

            expect(typeof token).toBe("string");
            expect(token.length).toBeGreaterThan(0);
        });
    });
});