import { Module, } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from "@nestjs/config"
import { MailerModule } from './mailer/mailer.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PubModule } from './pub/pub.module';
import { UserModule } from './user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { AdminModule } from './admin/admin.module';
import { ExpertModule } from './expert/expert.module';
import { AdminJwtStrategy } from './auth/admin-jwt.strategy';
import { UserJwtStrategy } from './user/user-jwt.strategy';
import { ServeStaticModule } from '@nestjs/serve-static';
//import { AdminJwtStrategy } from './admin-jwt.strategy';
import { NotificationModule } from './notification/notification.module';
import { StripeModule } from './stripe/stripe.module';
@Module({
  imports: [AuthModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), MailerModule, PassportModule, PubModule, UserModule,
    MulterModule.register({
      dest: './upload',

    }),
    ServeStaticModule.forRoot({
      rootPath: 'uploads', // Chemin vers votre dossier d'uploads
      serveRoot: '/uploads', // URL à laquelle les fichiers seront accessibles
    }),
    AdminModule,
    ExpertModule, JwtModule, NotificationModule, StripeModule],
  providers: [AdminJwtStrategy, UserJwtStrategy]
})
export class AppModule { }
