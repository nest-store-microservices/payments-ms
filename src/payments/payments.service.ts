import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dtos/payment-session.dto';

@Injectable()
export class PaymentsService {


    private readonly stripe = new Stripe(envs.stripeSecretKey);


    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {

        const { items, currency } = paymentSessionDto;

        const lineItems = items.map(item => {
            return {
                price_data: {
                    currency: currency,
                    product_data: {
                        name: item.name,
                    },
                    unit_amount: Math.round( item.price * 100 ) ,
                },
                quantity: item.quantity,
            }
        })

        const session = await this.stripe.checkout.sessions.create({
            payment_intent_data: {
                metadata: {}
            },
            line_items: lineItems,

            mode: 'payment',
            success_url: envs.frontendUrl + '/payments/success',
            cancel_url: envs.backendUrl + '/payments/cancelled',

        });

        return session;
    }

}
