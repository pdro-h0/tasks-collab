import { GenerateToken, ValidateToken } from "@/contracts/gateways";
import { InvalidToken, TokenExpired } from "@/domain/errors";
import { JwtPayload, sign, verify } from "jsonwebtoken";

export class JwtTokenHandler implements GenerateToken, ValidateToken {
  constructor(private readonly jwtSecret: string) {}
  async generate(input: GenerateToken.Input): Promise<GenerateToken.Output> {
    const expirationInSeconds = input.expiresInMs / 1000;
    return sign({ userId: input.userId, email: input.email }, this.jwtSecret, {
      expiresIn: expirationInSeconds,
    });
  }
  async verify(input: ValidateToken.Input): Promise<ValidateToken.Output> {
    try {
      const payload = verify(input.token, this.jwtSecret) as JwtPayload;
      return {
        userId: payload.userId,
        email: payload.email,
        iat: payload.iat,
        exp: payload.exp,
      };
    } catch (error) {
      if (error instanceof Error && error.name === "TokenExpiredError") {
        throw new TokenExpired();
      }
      throw new InvalidToken();
    }
  }
}
