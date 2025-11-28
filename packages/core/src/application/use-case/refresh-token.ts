import {
  GenerateToken,
  RefreshToken,
  ValidateToken,
} from "@/contracts/gateways";
import { GetUser } from "@/contracts/repos";
import { InvalidRefreshToken, UserNotFound } from "@/domain/errors";

export class RefreshTokenUseCase {
  constructor(
    private readonly userRepo: GetUser,
    private readonly tokenHandler: GenerateToken & ValidateToken,
  ) {}

  async execute(input: RefreshToken.Input): Promise<RefreshToken.Output> {
    const payload = await this.tokenHandler.verify({
      token: input.refreshToken,
    });
    if (!payload || !payload.userId) throw new InvalidRefreshToken();
    const user = await this.userRepo.getById({ id: payload.userId });
    if (!user) throw new UserNotFound();
    const accessTokenExpiresInMs = 900000; //15min
    const refreshTokenExpiresInMs = 604800000; //7days
    const newAccessToken = await this.tokenHandler.generate({
      userId: user.id,
      email: user.email,
      expiresInMs: accessTokenExpiresInMs,
    });
    const newRefreshToken = await this.tokenHandler.generate({
      userId: user.id,
      email: user.email,
      expiresInMs: refreshTokenExpiresInMs,
    });
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
