import { ComparePassword, GenerateToken } from "@/contracts/gateways";
import { GetUser, AuthenticateUser } from "@/contracts/repos";
import { InvalidCredentials, UserNotFound } from "@/domain/errors";

export class AuthenticateUseCase {
  constructor(
    private readonly userRepo: GetUser,
    private readonly passwordHasher: ComparePassword,
    private readonly tokenHandler: GenerateToken,
  ) {}
  async execute(input: AuthenticateUser.Input) {
    const user = await this.userRepo.getByEmail({ email: input.email });
    if (!user) throw new InvalidCredentials();
    const isPasswordValid = await this.passwordHasher.compare({
      password: input.password,
      hashedPassword: user.password,
    });
    if (!isPasswordValid) throw new InvalidCredentials();
    const accessToken = await this.tokenHandler.generate({
      userId: user.id,
      email: user.email,
      expiresInMs: 900000, //15min
    });
    const refreshToken = await this.tokenHandler.generate({
      userId: user.id,
      email: user.email,
      expiresInMs: 604800000, //7days
    });
    return { accessToken, refreshToken };
  }
}
