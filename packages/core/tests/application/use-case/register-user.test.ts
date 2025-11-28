import { HashPassword } from "@/contracts/gateways";
import { CreateUser, GetUser } from "@/contracts/repos";
import { RegisterUserUseCase } from "@/application/use-case";

describe("REGISTER USER", () => {
  let sut: RegisterUserUseCase;
  let userRepo: jest.Mocked<CreateUser & GetUser>;
  let passwordHasher: jest.Mocked<HashPassword>;
  let input: CreateUser.Input;

  beforeAll(() => {
    userRepo = {
      create: jest.fn(),
      getByEmail: jest.fn().mockResolvedValue(null),
      getById: jest.fn(),
    };
    passwordHasher = {
      hash: jest.fn().mockResolvedValue("any_hashed_password"),
    };
    input = {
      name: "any_name",
      email: "any_email",
      password: "any_password",
    };
  });

  beforeEach(async () => {
    sut = new RegisterUserUseCase(userRepo, passwordHasher);
  });

  it("should call CreateUser with correct input", async () => {
    await sut.execute(input);

    expect(userRepo.create).toHaveBeenCalledTimes(1);
    expect(userRepo.create).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      password: "any_hashed_password",
    });
  });

  it("Should call GetUser with correct input", async () => {
    await sut.execute(input);

    expect(userRepo.getByEmail).toHaveBeenCalledTimes(1);
    expect(userRepo.getByEmail).toHaveBeenCalledWith({
      email: "any_email",
    });
  });

  it("Should throw if user already exists", async () => {
    userRepo.getByEmail.mockResolvedValueOnce({
      id: "any_id",
      name: "any_name",
      email: "any_email",
      password: "any_hashed_password",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(sut.execute(input)).rejects.toThrow("User already registered");
  });

  it("Should call HashPassword with correct input", async () => {
    await sut.execute(input);

    expect(passwordHasher.hash).toHaveBeenCalledTimes(1);
    expect(passwordHasher.hash).toHaveBeenCalledWith({
      password: "any_password",
    });
  });
});
