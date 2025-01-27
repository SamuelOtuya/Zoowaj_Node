// controllers/payment.controller.js
import PaymentService from '../services/payment.service.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger/logger.js';

const paymentService = new PaymentService();

export const PaymentController = {
  // Initialize payment
  initializePayment: async (req, res, next) => {
    try {
      const { amount, subscriptionType } = req.body;
      const userId = req.user.id; // Assuming you have user info in request

      // Get user details
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const paymentData = {
        email: user.email,
        amount,
        userId,
        subscriptionType,
        reference: `PAY-${uuidv4()}`, // Generate unique reference
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      };

      const response = await paymentService.initializePayment(paymentData);
      res.status(200).json(response);
    } catch (error) {
      logger.error('Payment initialization controller error:', error);
      next(error);
    }
  },

  // Verify payment
  verifyPayment: async (req, res, next) => {
    try {
      const { reference } = req.query;
      if (!reference) {
        return res.status(400).json({ message: 'Payment reference is required' });
      }

      const paymentData = await paymentService.verifyPayment(reference);
      
      // If payment is successful, update user subscription
      if (paymentData.status === 'success') {
        const { userId, subscriptionType } = paymentData.metadata;
        
        await User.findByIdAndUpdate(userId, {
          subscribed: true,
          // Add any other subscription-related fields
        });

        logger.info(`Subscription updated for user ${userId}`);
      }

      res.status(200).json(paymentData);
    } catch (error) {
      logger.error('Payment verification controller error:', error);
      next(error);
    }
  },

  // Webhook handler for PayStack events
  handleWebhook: async (req, res, next) => {
    try {
      // Verify webhook signature
      const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (hash !== req.headers['x-paystack-signature']) {
        return res.status(400).json({ message: 'Invalid signature' });
      }

      const event = req.body;

      // Handle different event types
      switch (event.event) {
        case 'charge.success':
          // Handle successful charge
          const { reference, metadata } = event.data;
          await User.findByIdAndUpdate(metadata.userId, {
            subscribed: true,
            // Update other subscription details
          });
          break;

        case 'subscription.disable':
          // Handle subscription cancellation
          await User.findByIdAndUpdate(metadata.userId, {
            subscribed: false,
          });
          break;

        // Add other event types as needed
      }

      res.status(200).json({ message: 'Webhook processed successfully' });
    } catch (error) {
      logger.error('Webhook processing error:', error);
      next(error);
    }
  },

  // Get payment history
  getPaymentHistory: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const transactions = await paymentService.listTransactions({
        customer: req.user.email,
        status: 'success',
      });

      res.status(200).json(transactions);
    } catch (error) {
      logger.error('Payment history error:', error);
      next(error);
    }
  },
};