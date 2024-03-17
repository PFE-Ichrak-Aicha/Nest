import { Module } from '@nestjs/common';
import { PubService } from './pub.service';
import { PubController } from './pub.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { MediaModule } from 'src/media/media.module';
import { UserService } from 'src/user/user.service';
@Module({
  imports: [MediaModule],
  providers: [PubService ,PrismaService, MediaService,UserService],
  controllers: [PubController]
})
export class PubModule {}
