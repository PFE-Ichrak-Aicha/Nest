// admin-jwt.strategy.ts
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
type Payload = {
  sub: number,
  email: string
}


@Injectable()
export class UserJwtStrategy extends PassportStrategy(Strategy) {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  constructor(private readonly configService: ConfigService, private readonly prismaService: PrismaService, private readonly jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('SECRET_KEY'),
      ignoreExpiration: false,
    });
  }

  async validate(token: string): Promise<Payload> {
    try {
      const payload = await this.jwtService.verify(token);
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Unauthorized', error.message);
    }
  }
}
