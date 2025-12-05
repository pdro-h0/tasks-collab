import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import {
  AuthenticateUserDto,
  AuthResponseDto,
  CreateUserDto,
} from './dto/user.dto';
import {
  RegisterUserUseCase,
  BcryptHandler,
  AuthenticateUseCase,
  JwtTokenHandler,
  RefreshTokenUseCase,
} from '@tasks-collab/core';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';

@Controller()
export class UsersController {
  constructor(
    private readonly userRepo: UsersRepository,
    private readonly passwordHasher: BcryptHandler,
    private readonly tokenHandler: JwtTokenHandler,
  ) {}

  @MessagePattern({ cmd: 'user-registered' })
  async createUser(@Payload() body: CreateUserDto) {
    const useCase = new RegisterUserUseCase(this.userRepo, this.passwordHasher);
    try {
      await useCase.execute({
        name: body.name,
        email: body.email,
        password: body.password,
      });
      return { success: true };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'user-authenticated' })
  async createSession(@Body() body: AuthenticateUserDto) {
    const useCase = new AuthenticateUseCase(
      this.userRepo,
      this.passwordHasher,
      this.tokenHandler,
    );
    try {
      const { accessToken, refreshToken } = await useCase.execute({
        email: body.email,
        password: body.password,
      });
      return { accessToken, refreshToken };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  @MessagePattern({ cmd: 'user-refreshed' })
  async refreshSession(
    @Payload() refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const useCase = new RefreshTokenUseCase(this.userRepo, this.tokenHandler);
    try {
      const { accessToken, refreshToken: newRefreshToken } =
        await useCase.execute({
          refreshToken,
        });
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
