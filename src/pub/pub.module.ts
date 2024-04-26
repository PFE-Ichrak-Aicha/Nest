import { Module } from '@nestjs/common';
import { PubService } from './pub.service';
import { PubController } from './pub.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { MediaModule } from 'src/media/media.module';
import { UserService } from 'src/user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { UserJwtStrategy } from 'src/user/user-jwt.strategy';
@Module({
  imports: [
    JwtModule.register({
      secret: 'SECRET_KEY', // replace with your own secret key
    }),
  ],
  providers: [PubService ,PrismaService, MediaService,UserService,UserJwtStrategy],
  controllers: [PubController]
})
export class PubModule {}
