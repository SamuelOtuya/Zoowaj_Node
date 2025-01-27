// services/payment.service.js
import https from 'https';
import {
  BadRequestError,
  InternalServerError,
} from '../errors/application-error.js';
import logger from '../logger/logger.js';

export default class PaymentService {
  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY;
  }

  // Initialize payment
  async initializePayment(data) {
    try {
      const params = JSON.stringify({
        email: data.email,
        amount: data.amount * 100, // Convert to kobo/cents
        callback_url: data.callback_url,
        reference: data.reference,
        metadata: {
          userId: data.userId,
          subscriptionType: data.subscriptionType,
        },
      });

      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: '/transaction/initialize',
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            const response = JSON.parse(data);
            if (response.status) {
              logger.info(`Payment initialized for user ${params.email}`);
              resolve(response);
            } else {
              logger.error('Payment initialization failed:', response);
              reject(new Error(response.message));
            }
          });
        });

        req.on('error', (error) => {
          logger.error('Payment initialization error:', error);
          reject(error);
        });

        req.write(params);
        req.end();
      });
    } catch (error) {
      logger.error('Payment service error:', error);
      throw new InternalServerError('Payment initialization failed');
    }
  }

  // Verify payment
  async verifyPayment(reference) {
    try {
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction/verify/${reference}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            const response = JSON.parse(data);
            if (response.status && response.data.status === 'success') {
              logger.info(`Payment verified for reference ${reference}`);
              resolve(response.data);
            } else {
              logger.error('Payment verification failed:', response);
              reject(new Error(response.message));
            }
          });
        });

        req.on('error', (error) => {
          logger.error('Payment verification error:', error);
          reject(error);
        });

        req.end();
      });
    } catch (error) {
      logger.error('Payment verification service error:', error);
      throw new InternalServerError('Payment verification failed');
    }
  }

  // List transactions
  async listTransactions(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const options = {
        hostname: 'api.paystack.co',
        port: 443,
        path: `/transaction?${queryString}`,
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.secretKey}`,
        },
      };

      return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          let data = '';

          res.on('data', (chunk) => {
            data += chunk;
          });

          res.on('end', () => {
            const response = JSON.parse(data);
            if (response.status) {
              resolve(response.data);
            } else {
              reject(new Error(response.message));
            }
          });
        });

        req.on('error', (error) => {
          reject(error);
        });

        req.end();
      });
    } catch (error) {
      logger.error('List transactions error:', error);
      throw new InternalServerError('Failed to list transactions');
    }
  }
}