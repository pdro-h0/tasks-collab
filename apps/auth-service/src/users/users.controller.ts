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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('sessions')
  async createSession(
    @Body() body: AuthenticateUserDto,
    @Res({ passthrough: true }) response,
  ) {
    const useCase = new AuthenticateUseCase(
      this.userRepo,
      this.passwordHasher,
      this.tokenHandler,
    );
    const { token } = await useCase.execute({
      email: body.email,
      password: body.password,
    });

    response.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return;
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refreshSession(
    @Req() request,
    @Res({ passthrough: true }) response,
  ): Promise<AuthResponseDto> {
    const refreshToken = request.cookies?.accessToken;
    if (!refreshToken) {
      console.log(request.cookies);
      throw new Error(request.cookies);
    }

    const useCase = new RefreshTokenUseCase(this.userRepo, this.tokenHandler);
    const { accessToken, refreshToken: newRefreshToken } =
      await useCase.execute({
        refreshToken,
      });

    response.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/refresh',
    });

    return { token: accessToken };
  }
}
