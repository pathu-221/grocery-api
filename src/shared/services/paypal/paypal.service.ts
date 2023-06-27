import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Payment, configure, payment, PaymentResponse, payout } from 'paypal-rest-sdk';
import { Cart, Product } from '@prisma/client';
import { PaypalBatchHeader } from 'src/shared/interfaces/paypal.payout';

@Injectable()
export class PaypalService {
  constructor(private readonly configService: ConfigService) {
    configure({
      mode: this.configService.get('PAYPAL_ENV'),
      client_id: this.configService.get('PAYPAL_CLIENT_ID'),
      client_secret: this.configService.get('PAYPAL_CLIENT_SECRET'),
    });
  }

  /**
   * generated paypal json for checkout orders
   * @param items 
   * @param userId 
   * @param total 
   * @param description 
   */
  generatePaypalCheckoutJson(
    items: (Cart & { product?: Product; })[],
    userId: string,
    total: number,
    orderId: string,
    description?: string,
  ){

    const paypalJson: Payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${this.configService.get<string>(
          'API_ENDPOINT',
        )}/orders/success?userId=${userId}&orderId=${orderId}`,
        cancel_url: `${this.configService.get<string>('API_ENDPOINT')}/orders/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: items.map(((item) => {
              return {
                name: item.product.name,
                price: item.product.base_price.toString(),
                currency: "USD",
                quantity: item.quantity,
              }
            })),
          },
          amount: {
            currency: 'USD',
            total: total.toFixed(2),
          },
          description: description || 'Checkout purchase',
        },
      ],
    };
    return paypalJson;
  }

  /**
   * generate paypal json for store orders
   * @param userId 
   * @param storeId 
   * @param storeName 
   * @param storePrice 
   * @param description 
   * @returns 
   */
  generatePaypalStoreJson(
    userId: string,
    storeId: string,
    storeName: string,
    storePrice: number,
    description?: string,
  ) {
    const paypalJson:Payment = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      redirect_urls: {
        return_url: `${this.configService.get<string>(
          'API_ENDPOINT',
        )}/store/success?userId=${userId}&storeId=${storeId}`,
        cancel_url: `${this.configService.get<string>('API_ENDPOINT')}/store/cancel`,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: storeName,
                price: storePrice.toString(),
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: storePrice.toFixed(2),
          },
          description: description || 'Store purchase',
        },
      ],
    };

    return paypalJson;
  }

  /**
   * Generate paypal payment url
   *
   * @returns
   */
  async generatePaypalPaymentUrl(paypalJson: Payment):Promise<PaymentResponse> {
    return new Promise((resolve, reject) => {
      payment.create(paypalJson, (error, payment) => {
        if (error) {
          console.log(error);
          reject('Unable to proceed with payment!');
        }

        resolve(payment);
      });
    });
  }

  /**
   * Get payment details by payment id
   *
   * @param paymentId payment id from paypal
   */
  async getPaymentDetailsByPaymentId(paymentId: string):Promise<PaymentResponse> {
    return new Promise((resolve, reject) => {
      payment.get(paymentId, (error, payment) => {
        if (error) {
          console.log(error);
          reject('Unable to fetch payment details!');
        }

        resolve(payment);
      });
    });
  }

  /**
   * to execute the payment
   * @param payerId 
   * @param paymentId 
   * @param executePaymentJson 
   * @returns payment data
   */
  async executePayment(payerId: string, paymentId: string, executePaymentJson: payment.ExecuteRequest):Promise<PaymentResponse> {
    return new Promise((resolve, reject) => {
      payment.execute(paymentId, executePaymentJson, (error, payment) => {
        if(error){
          reject('Unable to process payment');
        }

        resolve(payment);
      })
    })
  }


  generateSenderBatchId(){
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const currentDate = date.getDate();
    const time = date.getTime();

    return `${year}${month}${currentDate}${time}`
  }

  generatePayoutJson(payoutEmail: string, totalPayout: number, emailSubject?: string){
    const senderBatchId = this.generateSenderBatchId();
    const payoutJson = {
      sender_batch_header: {
        sender_batch_id: senderBatchId,
        email_subject: emailSubject || 'You have a payout!',
        email_messaege: 'You have received a payout!',
      },
      items: [
        {
          recipient_type: 'EMAIL',
          amount: {
            value: totalPayout,
            currency: 'USD'
          },
          sender_item_id: senderBatchId,
          receiver: payoutEmail,
          note: "Thank you for your patronage!",
        }
      ]
    }

    return payoutJson;
  }

  async getPayoutDetails(payoutBatchId: string){
    return new Promise((resolve, reject) => {
      payout.get(payoutBatchId, (error, payout) => {

        if(error){
          console.error('Unable to create Payout!');
          reject(error)
        } 

        resolve(payout);
      })
    })
  }

  async executePayout(payoutJson: any):Promise<PaypalBatchHeader>{
    return new Promise((resolve, reject) => {
      payout.create(payoutJson, 'false', (error, payout) => {

        if(error){
          console.error('Unable to create Payout!');
          reject(error)
        } 

        resolve(payout);
      })
    })
  }
}
