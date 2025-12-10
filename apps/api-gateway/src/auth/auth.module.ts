import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtTokenHandler } from '@tasks-collab/core';
import { JwtStrategy } from './jwt-strategy';

@Module({
  imports: [PassportModule],
  providers: [
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
    JwtStrategy,
  ],
  exports: [JwtStrategy],
})
export class AuthModule {}
