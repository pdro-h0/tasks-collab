export interface CreateUser {
  create(input: CreateUser.Input): Promise<void>;
}
export namespace CreateUser {
  export type Input = {
    name: string;
    email: string;
    password: string;
  };
}

export class RegisterUser {
  constructor(private userRepo: CreateUser) {}

  async execute(input: CreateUser.Input): Promise<void> {
    await this.userRepo.create(input);
  }
}

describe("REGISTER USER", () => {
  let sut: RegisterUser;
  let userRepo: CreateUser;

  beforeAll(() => {
    userRepo = {
      create: jest.fn(),
    };
  });

  beforeEach(async () => {
    sut = new RegisterUser(userRepo);
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
