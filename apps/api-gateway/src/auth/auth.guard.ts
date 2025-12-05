import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtTokenHandler } from '@tasks-collab/core';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtTokenHandler: JwtTokenHandler) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    console.log({ token });
    if (!token) throw new UnauthorizedException('No token provided');
    try {
      const payload = await this.jwtTokenHandler.verify({ token });
      request['user'] = payload;
      console.log(payload);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
  private extractTokenFromHeader(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
