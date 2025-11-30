import { GenerateToken, ValidateToken } from "@/contracts/gateways";
import { JwtTokenHandler } from "@/infra/gateways/jwt-token-handler";
import jwt from "jsonwebtoken";

jest.mock("jsonwebtoken");

describe("JWT TOKEN HANDLER", () => {
  let sut: JwtTokenHandler;
  let fakeJwt: jest.Mocked<typeof jwt>;
  let secret: string;

  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    secret = "any_secret";
  });

  beforeEach(async () => {
    sut = new JwtTokenHandler(secret);
  });

  describe("generate", () => {
    let token: string;
    let input: GenerateToken.Input;

    beforeAll(() => {
      token = "any_token";
      input = {
        userId: "any_id",
        email: "any_email",
        expiresInMs: 900000, //15min
      };
      fakeJwt.sign.mockImplementation(() => token);
    });

    it("should call sign with correct input", async () => {
      await sut.generate(input);
      expect(fakeJwt.sign).toHaveBeenCalledTimes(1);
      expect(fakeJwt.sign).toHaveBeenCalledWith(
        { userId: "any_id", email: "any_email" },
        secret,
        { expiresIn: 900 },
      );
    });

    it("Should return a token", async () => {
      const result = await sut.generate(input);
      expect(result).toBe(token);
    });

    it("Should rethrow if sign throws", async () => {
      fakeJwt.sign.mockImplementationOnce(() => {
        throw new Error("token_error");
      });
      await expect(sut.generate(input)).rejects.toThrow("token_error");
    });
  });

  describe("verify", () => {
    let token: string;
    let input: ValidateToken.Input;

    beforeAll(() => {
      token = "any_token";
      input = {
        token,
      };
      fakeJwt.verify.mockImplementation(() => ({
        userId: "any_id",
        email: "any_email",
        iat: 1,
        exp: 2,
      }));
    });

    it("should call verify with correct input", async () => {
      await sut.verify(input);
      expect(fakeJwt.verify).toHaveBeenCalledTimes(1);
      expect(fakeJwt.verify).toHaveBeenCalledWith(token, secret);
    });

    it("Should return a token", async () => {
      const result = await sut.verify(input);
      expect(result).toEqual({
        userId: "any_id",
        email: "any_email",
        iat: 1,
        exp: 2,
      });
    });

    it("Should rethrow if verify throws InvalidToken", async () => {
      fakeJwt.verify.mockImplementationOnce(() => {
        throw new Error("Invalid token");
      });
      await expect(sut.verify(input)).rejects.toThrow("Invalid token");
    });

    it("Should rethrow if verify throws TokenExpired", async () => {
      const error = new Error("Token expired");
      error.name = "TokenExpiredError";
      fakeJwt.verify.mockImplementationOnce(() => {
        throw error;
      });
      await expect(sut.verify(input)).rejects.toThrow("Token expired");
    });
  });
});
