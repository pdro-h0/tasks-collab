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
import { AuthenticateUserDto, CreateUserDto } from './dto/user.dto';

@Controller()
export class UserController {
  constructor(
    @Inject('AUTH-SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post('users')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() req: CreateUserDto) {
    const result = await firstValueFrom(
      this.userClient.send({ cmd: 'user-registered' }, req),
    );
    return result;
  }

  @Post('sessions')
  async createSession(
    @Body() req: AuthenticateUserDto,
    @Res({ passthrough: true }) response,
  ) {
    const { accessToken, refreshToken } = await firstValueFrom(
      this.userClient.send({ cmd: 'user-authenticated' }, req),
    );

    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: 'api/refresh',
    });
    return { accessToken };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshSession(@Req() req, @Res({ passthrough: true }) response) {
    const oldRefreshToken = req.cookies?.refreshToken;
    const { accessToken, refreshToken } = await firstValueFrom(
      this.userClient.send({ cmd: 'user-refreshed' }, oldRefreshToken),
    );
    response.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: 'api/refresh',
    });
    return { accessToken };
  }
}
