import { ComparePassword, GenerateToken } from "@/contracts/gateways";
import { GetUser, AuthenticateUser } from "@/contracts/repos";
import { AuthenticateUseCase } from "@/application/use-case";

describe("AUTHENTICATE", () => {
  let sut: AuthenticateUseCase;
  let userRepo: jest.Mocked<GetUser>;
  let passwordHasher: jest.Mocked<ComparePassword>;
  let tokenHandler: jest.Mocked<GenerateToken>;
  let input: AuthenticateUser.Input;

  beforeAll(() => {
    userRepo = {
      getByEmail: jest.fn().mockResolvedValue({
        id: "any_id",
        name: "any_name",
        email: "any_email",
        password: "any_password",
      }),
      getById: jest.fn(),
    };
    passwordHasher = {
      compare: jest.fn().mockResolvedValue(true),
    };
    tokenHandler = {
      generate: jest.fn().mockResolvedValue("any_token"),
    };
    input = {
      email: "any_email",
      password: "any_password",
    };
  });

  beforeEach(() => {
    sut = new AuthenticateUseCase(userRepo, passwordHasher, tokenHandler);
  });

  it("Should call getUserByEmail with correct email", async () => {
    await sut.execute(input);
    expect(userRepo.getByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.getByEmail).toHaveBeenCalledWith({ email: "any_email" });
  });

  it("Should throw error if GetUser returns null", async () => {
    userRepo.getByEmail.mockResolvedValueOnce(null);
    await expect(() => sut.execute(input)).rejects.toThrow("User not found");
  });

  it("Should throw error if ComparePassword returns false", async () => {
    passwordHasher.compare.mockResolvedValueOnce(false);
    await expect(() => sut.execute(input)).rejects.toThrow(
      "Invalid credentials",
    );
  });

  it("Should call GenerateToken with correct input", async () => {
    await sut.execute(input);
    expect(tokenHandler.generate).toHaveBeenCalledTimes(1);
    expect(tokenHandler.generate).toHaveBeenCalledWith({
      userId: "any_id",
      email: "any_email",
      expiresInMs: 900000,
    });
  });
});
