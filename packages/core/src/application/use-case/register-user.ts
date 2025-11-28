import { HashPassword } from "@/contracts/gateways";
import { CreateUser, GetUser } from "@/contracts/repos";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepo: CreateUser & GetUser,
    private readonly passwordHasher: HashPassword,
  ) {}

  async execute(input: CreateUser.Input): Promise<void> {
    const userWithSameEmail = await this.userRepo.getByEmail({
      email: input.email,
    });
    if (userWithSameEmail) throw new Error("User already registered");
    const passwordHashed = await this.passwordHasher.hash({
      password: input.password,
    });
    await this.userRepo.create({
      ...input,
      password: passwordHashed,
    });
  }
}
