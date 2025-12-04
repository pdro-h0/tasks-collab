import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateUserDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject('AUTH-SERVICE') private readonly userClient: ClientProxy,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  async createUser(@Body() req: CreateUserDto) {
    const result = await firstValueFrom(
      this.userClient.send({ cmd: 'user-registered' }, req),
    );
    return result;
  }
}
