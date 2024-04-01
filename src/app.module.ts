import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from "@nestjs/config"
import { MailerModule } from './mailer/mailer.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PubModule } from './pub/pub.module';
import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { MediaModule } from './media/media.module';
import { AdminModule } from './admin/admin.module';
import * as cors from 'cors';
@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), MailerModule , PassportModule , JwtModule, PubModule, UserModule,
    MulterModule.register({
    dest: './upload',

  }),
    MediaModule,
    AdminModule,]
})
export class AppModule {}
 
