import { Inject, Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dtos/payment-session.dto';
import { Request, Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class PaymentsService {

    constructor(
        @Inject('NATS_SERVICE') private readonly natsClient: ClientProxy,
    ) {}

    private readonly stripe = new Stripe(envs.stripeSecretKey);


    async createPaymentSession(paymentSessionDto: PaymentSessionDto) {

        const { items, currency, orderId } = paymentSessionDto;

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
                metadata: {
                    orderId: orderId,
                }
            },
            line_items: lineItems,

            mode: 'payment',
            success_url: envs.frontendUrl + '/payments/success',
            cancel_url: envs.backendUrl + '/payments/cancelled',

        });

        return {
            cancelUrl: session.cancel_url,
            successUrl: session.success_url,
            sessionUrl: session.url,
        };
    }


    async handleWebhook(req: Request, res: Response) {
        const signature = req.headers['stripe-signature'];
       
        const endPointSecret = envs.endPointSecret;
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req['rawBody'],
                signature!,
                endPointSecret
            );
        } catch (error) {
            console.log('Error while verifying webhook signature: ', error);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }


        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object
               
                const payload = {
                    stripePaymentId: chargeSucceeded.id,
                    orderId: chargeSucceeded.metadata.orderId,
                    receipUrl: chargeSucceeded.receipt_url,
                }
                console.log({payload})
                this.natsClient.emit('payment.succeeded', payload);
                break;
          
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

       
        return res.status(200).json(signature);
    }

}
