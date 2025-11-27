import { CreateUser } from "@/contracts/repos";
import { RegisterUserUseCase } from "@/users/use-case";

describe("REGISTER USER", () => {
  let sut: RegisterUserUseCase;
  let userRepo: CreateUser;

  beforeAll(() => {
    userRepo = {
      create: jest.fn(),
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
});
