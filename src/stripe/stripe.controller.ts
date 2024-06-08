import { Body, Controller, Param, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
//import { PaymentDto } from 'dto/PaymentDto';
import { PaymentDto } from 'dto/paymentDto';
@Controller('stripe')
export class StripeController {
    constructor(private readonly stripeService: StripeService) {}

    @Post(':userId/:pid/:ide')
    async createStripe(@Param('userId') userId: string ,@Param('pid') pid: string,@Param('ide') ide: string, @Body() paymentData: PaymentDto): Promise<string> {
      return this.stripeService.createStripe(userId, pid , ide, paymentData);
    }
  
}
