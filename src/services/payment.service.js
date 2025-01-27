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

  // Create subscription plan
  async createPlan({ name, amount, interval }) {
    try {
      const params = JSON.stringify({
        name,
        amount: amount * 100,
        interval,
        currency: 'KES'
      });

      const response = await this.makeRequest('/plan', 'POST', params);
      logger.info(`Created subscription plan: ${name}`);
      return response.data;
    } catch (error) {
      logger.error('Plan creation error:', error);
      throw new InternalServerError('Failed to create subscription plan');
    }
  }

  // Create subscription
  async createSubscription(data) {
    try {
      const params = JSON.stringify({
        customer: data.email,
        plan: data.planCode,
        metadata: {
          userId: data.userId,
          subscriptionType: data.subscriptionType
        }
      });

      const response = await this.makeRequest('/subscription', 'POST', params);
      logger.info(`Created subscription for user: ${data.email}`);
      return response.data;
    } catch (error) {
      logger.error('Subscription creation error:', error);
      throw new InternalServerError('Failed to create subscription');
    }
  }

  // Process refund
  async processRefund(data) {
    try {
      const params = JSON.stringify({
        transaction: data.transactionReference,
        merchant_note: data.reason
      });

      const response = await this.makeRequest('/refund', 'POST', params);
      logger.info(`Processed refund for transaction: ${data.transactionReference}`);
      return response.data;
    } catch (error) {
      logger.error('Refund processing error:', error);
      throw new InternalServerError('Failed to process refund');
    }
  }

  // Get payment analytics
  async getAnalytics(startDate, endDate) {
    try {
      const params = new URLSearchParams({
        from: startDate,
        to: endDate
      });

      const [transactions, totalRevenue] = await Promise.all([
        this.makeRequest(`/transaction?${params}`, 'GET'),
        this.makeRequest(`/transaction/totals?${params}`, 'GET')
      ]);

      const analytics = this.processAnalytics(transactions.data, totalRevenue.data);
      logger.info('Retrieved payment analytics');
      return analytics;
    } catch (error) {
      logger.error('Analytics retrieval error:', error);
      throw new InternalServerError('Failed to retrieve analytics');
    }
  }

  // Helper method to process analytics data
  processAnalytics(transactions, totals) {
    const analytics = {
      totalRevenue: totals.total_volume / 100,
      successfulTransactions: totals.total_transactions,
      averageTransactionValue: (totals.total_volume / totals.total_transactions / 100) || 0,
      transactionsByDay: {},
      subscriptionMetrics: {
        activeSubscriptions: 0,
        cancelledSubscriptions: 0,
        renewalRate: 0
      }
    };

    // Process transactions by day
    transactions.forEach(transaction => {
      const date = new Date(transaction.created_at).toISOString().split('T')[0];
      if (!analytics.transactionsByDay[date]) {
        analytics.transactionsByDay[date] = {
          count: 0,
          volume: 0
        };
      }
      analytics.transactionsByDay[date].count++;
      analytics.transactionsByDay[date].volume += transaction.amount / 100;
    });

    return analytics;
  }

  // Helper method to make PayStack API requests
  makeRequest(path, method, params = null) {
    const options = {
      hostname: 'api.paystack.co',
      port: 443,
      path,
      method,
      headers: {
        Authorization: `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.status) {
              resolve(response);
            } else {
              reject(new Error(response.message));
            }
          } catch (error) {
            reject(error);
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (params) {
        req.write(params);
      }
      req.end();
    });
  }
}