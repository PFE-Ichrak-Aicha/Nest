import { Module } from '@nestjs/common';
import { PubService } from './pub.service';
import { PubController } from './pub.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';
import { MediaModule } from 'src/media/media.module';
@Module({
  imports: [MediaModule],
  providers: [PubService ,PrismaService, MediaService,],
  controllers: [PubController]
})
export class PubModule {}
