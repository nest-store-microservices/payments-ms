import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dtos/payment-session.dto';
import { Request, Response } from 'express';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}


  @Post('create-payment-session')
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    
    return this.paymentsService.createPaymentSession(paymentSessionDto);
  }

  @Get('success')
  paymentSuccess() {
    return {
      'ok': true,
      'message': 'Payment was successful!',
    };
  }

  @Get('cancelled')
  paymentCancel() {
    return {
      'ok': false,
      'message': 'Payment was cancelled!',
    };
  }

  @Post('webhook')
 async handleWebhook(@Req() req: Request, @Res() res: Response) {
  
    return this.paymentsService.handleWebhook(req, res);
  }


}
