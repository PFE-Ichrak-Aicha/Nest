import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "src/prisma/prisma.service";
type Payload = {
    sub: number,
    email: string
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        throw new Error('Method not implemented.');
    }
    constructor(configService: ConfigService, private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get("SECRET_KEY"),
            ignoreExpiration: false
        })
    }
    async validate(payload: Payload) {
        const user = await this.prismaService.user.findUnique({ where: { email: payload.email } })
        if (!user) throw new UnauthorizedException("Unauthorized")
          const isAdmin = await this.prismaService.admin.findUnique({ where: { email: payload.email } });
        if (!isAdmin) throw new UnauthorizedException("Unauthorized");
        Reflect.deleteProperty(user, "MotDePasse")
        console.log(user)
        return user
    }

  /*async validate(payload: Payload, req: Request) {
    const user = await this.prismaService.user.findUnique({
      where: { email: payload.email },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    const admin = await this.prismaService.admin.findUnique({
      where: { email: payload.email },
    });

    if (!admin || !admin.isAdmin) {
      throw new UnauthorizedException();
    }

    // add the user object to the request object
    req['user'] = user;

    return user;
  }*/
}