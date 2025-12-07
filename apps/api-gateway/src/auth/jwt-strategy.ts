import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import type { ValidateToken } from '@tasks-collab/core/types';
import { ConfigService } from '@nestjs/config';
import { JwtTokenHandler } from '@tasks-collab/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(JwtTokenHandler)
    private readonly tokenHandler: ValidateToken,
    private readonly config: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    if (!token) {
      return null;
    }

    try {
      const user = await this.tokenHandler.verify({ token });
      return { userId: user.userId, email: user.email };
    } catch {
      return null;
    }
  }
}
