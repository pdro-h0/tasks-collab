import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  AuthenticateUserDto,
  AuthResponseDto,
  CreateUserDto,
} from './dto/user.dto';

@Controller()
export class UserController {
  constructor(
    @Inject('AUTH-SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('users')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createUser(@Body() req: CreateUserDto) {
    const result = await firstValueFrom(
      this.userClient.send({ cmd: 'user-registered' }, req),
    );
    return result;
  }

  @Post('sessions')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createSession(
    @Body() req: AuthenticateUserDto,
    @Res({ passthrough: true }) response,
  ) {
    const result = await firstValueFrom(
      this.userClient.send({ cmd: 'user-authenticated' }, req),
    );
    response.cookie('accessToken', result, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return result;
  }

  @Post('refresh')
  @HttpCode(HttpStatus.NO_CONTENT)
  async refreshSession(
    @Req() req,
    @Res({ passthrough: true }) response,
  ): Promise<AuthResponseDto> {
    const oldRefreshToken = req.cookies?.refreshToken;
    const { token, refreshToken } = await firstValueFrom(
      this.userClient.send({ cmd: 'user-refreshed' }, oldRefreshToken),
    );
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: 'api/refresh',
    });
    return token;
  }
}
