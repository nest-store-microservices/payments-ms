import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}


  @Post('create-payment-session')
  createPaymentSession() {

    return 'Payment session created successfully!';
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
 async handleWebhook() {
    return 'Webhook received!';
  }


}
