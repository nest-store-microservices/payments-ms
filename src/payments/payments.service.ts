import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dtos/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {


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

        return session;
    }


    async handleWebhook(req: Request, res: Response) {
        const signature = req.headers['stripe-signature'];
        //const endPintSecret = 'whsec_75f32aedbe35a4b689f4d0738ca91b00ebfc13e0fe4e65713bc7913f19489f9a'
        const endPintSecret = 'whsec_Dwc9pAPnc8peO6ZL5MKMqqjFgWvVt7rM';
        let event: Stripe.Event;

        try {
            event = this.stripe.webhooks.constructEvent(
                req['rawBody'],
                signature!,
                endPintSecret
            );
        } catch (error) {
            console.log('Error while verifying webhook signature: ', error);
            return res.status(400).send(`Webhook Error: ${error.message}`);
        }


        switch (event.type) {
            case 'charge.succeeded':
                const chargeSucceeded = event.data.object
               
                console.log({
                    metadata: chargeSucceeded.metadata,
                    orderId: chargeSucceeded.metadata.orderId,
                });
                break;
          
            default:
                console.log(`Unhandled event type ${event.type}`);
        }

       
        return res.status(200).json(signature);
    }

}
