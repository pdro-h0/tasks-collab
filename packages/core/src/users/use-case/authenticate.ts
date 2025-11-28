import { ComparePassword } from "@/contracts/gateways";
import { GetUser, AuthenticateUser } from "@/contracts/repos";

export class AuthenticateUseCase {
  constructor(
    private userRepo: GetUser,
    private passwordHasher: ComparePassword,
  ) {}
  async execute(input: AuthenticateUser.Input) {
    const user = await this.userRepo.getByEmail({ email: input.email });
    if (!user) throw new Error("User not found");
    const isPasswordValid = await this.passwordHasher.compare({
      password: input.password,
      hashedPassword: user.password,
    });
    if (!isPasswordValid) throw new Error("Invalid credentials");
  }
}
