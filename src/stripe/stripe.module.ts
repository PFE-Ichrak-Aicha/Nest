import { Module } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { StripeController } from './stripe.controller';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationGateway } from 'src/notification/notification.gateway';
import { ExpertService } from 'src/expert/expert.service';

@Module({
  providers: [StripeService,JwtService,UserService,NotificationService,NotificationGateway,ExpertService],
  controllers: [StripeController]
})
export class StripeModule {}
