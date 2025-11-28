import { ComparePassword } from "@/contracts/gateways";
import { GetUser, AuthenticateUser } from "@/contracts/repos";
import { AuthenticateUseCase } from "@/application/use-case";

describe("AUTHENTICATE", () => {
  let sut: AuthenticateUseCase;
  let userRepo: jest.Mocked<GetUser>;
  let passwordHasher: jest.Mocked<ComparePassword>;
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
    input = {
      email: "any_email",
      password: "any_password",
    };
  });

  beforeEach(() => {
    sut = new AuthenticateUseCase(userRepo, passwordHasher);
  });

  it("Should call getUserByEmail with correct email", () => {
    sut.execute(input);
    expect(userRepo.getByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.getByEmail).toHaveBeenCalledWith({ email: "any_email" });
  });

  it("Should throw error if GetUser returns null", () => {
    userRepo.getByEmail.mockResolvedValueOnce(null);
    expect(() => sut.execute(input)).rejects.toThrow("User not found");
  });

  it("Should throw error if ComparePassword returns false", () => {
    passwordHasher.compare.mockResolvedValue(false);
    expect(() => sut.execute(input)).rejects.toThrow("Invalid credentials");
  });
});
