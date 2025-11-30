import { BcryptHandler } from "@/infra/gateways";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");

describe("BCRYPT HANDLER", () => {
  let sut: BcryptHandler;
  let fakeBcrypt: jest.Mocked<typeof bcrypt>;

  beforeAll(() => {
    fakeBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
  });

  beforeEach(() => {
    fakeBcrypt.hash.mockImplementation(() => "any_password_hash");
    fakeBcrypt.compare.mockImplementation(() => true);
    sut = new BcryptHandler();
  });

  describe("hash", () => {
    it("Should call hash with correct input", async () => {
      await sut.hash({
        password: "any_password",
      });

      expect(fakeBcrypt.hash).toHaveBeenCalledTimes(1);
      expect(fakeBcrypt.hash).toHaveBeenCalledWith("any_password", 6);
    });

    it("Should return the hashed password", async () => {
      const result = await sut.hash({
        password: "any_password",
      });

      expect(result).toBe("any_password_hash");
    });
  });

  describe("compare", () => {
    it("Should call compare with correct input", async () => {
      await sut.compare({
        password: "any_password",
        hashedPassword: "any_password_hash",
      });

      expect(fakeBcrypt.compare).toHaveBeenCalledTimes(1);
      expect(fakeBcrypt.compare).toHaveBeenCalledWith(
        "any_password",
        "any_password_hash",
      );
    });

    it("Should return true when passwords match", async () => {
      const result = await sut.compare({
        password: "any_password",
        hashedPassword: "any_password_hash",
      });

      expect(result).toBe(true);
    });
  });
});
