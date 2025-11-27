import { CreateUser, GetUser } from "@/contracts/repos";
import { RegisterUserUseCase } from "@/users/use-case";

describe("REGISTER USER", () => {
  let sut: RegisterUserUseCase;
  let userRepo: jest.Mocked<CreateUser & GetUser>;

  beforeAll(() => {
    userRepo = {
      create: jest.fn(),
      getByEmail: jest.fn(),
    };
  });

  beforeEach(async () => {
    sut = new RegisterUserUseCase(userRepo);
  });

  it("should call CreateUser with correct input", async () => {
    await sut.execute({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(userRepo.create).toHaveBeenCalledWith({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });
  });

  it("Should call GetUser with correct input", async () => {
    await sut.execute({
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    expect(userRepo.getByEmail).toHaveBeenCalledWith({
      email: "any_email",
    });
  });

  it("Should throw if user already exists", async () => {
    userRepo.getByEmail.mockResolvedValue({
      id: "any_id",
      name: "any_name",
      email: "any_email",
      password: "any_password",
    });

    await expect(
      sut.execute({
        name: "any_name",
        email: "any_email",
        password: "any_password",
      }),
    ).rejects.toThrow("User already registered");
  });
});
