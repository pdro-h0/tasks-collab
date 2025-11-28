import { RefreshTokenUseCase } from "@/application/use-case";
import { GenerateToken, ValidateToken } from "@/contracts/gateways";
import { GetUser } from "@/contracts/repos";

describe("REFRESH TOKEN", () => {
  let sut: RefreshTokenUseCase;
  let userRepo: jest.Mocked<GetUser>;
  let tokenHandler: jest.Mocked<GenerateToken & ValidateToken>;
  const input = {
    refreshToken: "any_refresh_token",
  };
  const mockTokenPayload = {
    userId: "any_id",
    email: "any_email@example.com",
  };
  const mockAccessToken = "new_access_token";
  const mockRefreshToken = "new_refresh_token";

  beforeAll(() => {
    userRepo = {
      getById: jest.fn().mockResolvedValue({
        id: "any_id",
        name: "any_name",
        email: "any_email@example.com",
        password: "hashed_password",
      }),
      getByEmail: jest.fn(),
    };
    tokenHandler = {
      generate: jest.fn().mockResolvedValue(mockRefreshToken),
      verify: jest.fn().mockResolvedValue(mockTokenPayload),
    };
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sut = new RefreshTokenUseCase(userRepo, tokenHandler);
  });

  it("should call ValidateToken with correct input", async () => {
    await sut.execute(input);

    expect(tokenHandler.verify).toHaveBeenCalledTimes(1);
    expect(tokenHandler.verify).toHaveBeenCalledWith({
      token: input.refreshToken,
    });
  });

  it("should throw if token is invalid", async () => {
    const error = new Error("Invalid refresh token");
    tokenHandler.verify.mockRejectedValueOnce(error);

    await expect(sut.execute(input)).rejects.toThrow("Invalid refresh token");
  });

  it("should throw if token payload is missing userId", async () => {
    const invalidPayload = { email: "any@email.com" } as any;
    tokenHandler.verify.mockResolvedValueOnce(invalidPayload);

    await expect(sut.execute(input)).rejects.toThrow("Invalid refresh token");
  });

  it("should call GetUser with correct user ID", async () => {
    await sut.execute(input);

    expect(userRepo.getById).toHaveBeenCalledTimes(1);
    expect(userRepo.getById).toHaveBeenCalledWith({
      id: mockTokenPayload.userId,
    });
  });

  it("should throw if user is not found", async () => {
    userRepo.getById.mockResolvedValueOnce(null as any);

    await expect(sut.execute(input)).rejects.toThrow("User not found");
  });

  it("should call GenerateToken with correct parameters", async () => {
    await sut.execute(input);

    expect(tokenHandler.generate).toHaveBeenCalledTimes(2);
    expect(tokenHandler.generate).toHaveBeenCalledWith({
      userId: "any_id",
      email: "any_email@example.com",
      expiresInMs: 900000,
    });
    expect(tokenHandler.generate).toHaveBeenCalledWith({
      userId: "any_id",
      email: "any_email@example.com",
      expiresInMs: 604800000,
    });
  });

  it("should return new access and refresh tokens", async () => {
    tokenHandler.generate.mockResolvedValueOnce(mockAccessToken);
    const result = await sut.execute(input);

    expect(result).toEqual({
      accessToken: mockAccessToken,
      refreshToken: mockRefreshToken,
    });
  });
});
