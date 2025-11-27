import { CreateUser, GetUser } from "@/contracts/repos";

export class RegisterUserUseCase {
  constructor(private userRepo: CreateUser & GetUser) {}

  async execute(input: CreateUser.Input): Promise<void> {
    const userWithSameEmail = await this.userRepo.getByEmail({
      email: input.email,
    });
    if (userWithSameEmail) throw new Error("User already registered");
    await this.userRepo.create(input);
  }
}
