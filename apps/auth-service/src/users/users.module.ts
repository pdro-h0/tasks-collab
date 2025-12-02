import { Module } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersController } from './users.controller';
import { ConfigModule } from '@nestjs/config';
import { BcryptHandler, JwtTokenHandler } from '@tasks-collab/core';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../db/entities/user.entity';

@Module({
  imports: [ConfigModule.forRoot(), TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UsersRepository,
    BcryptHandler,
    {
      provide: JwtTokenHandler,
      useFactory: async (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is not defined in environment variables');
        }
        return new JwtTokenHandler(secret);
      },
      inject: [ConfigService],
    },
  ],
})
export class UsersModule {}
