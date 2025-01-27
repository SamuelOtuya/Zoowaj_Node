// controllers/payment.controller.js
import PaymentService from '../services/payment.service.js';
import User from '../models/User.js';
import { v4 as uuidv4 } from 'uuid';
import logger from '../logger/logger.js';

const paymentService = new PaymentService();

export const PaymentController = {
  // Create subscription plan
  createPlan: async (req, res, next) => {
    try {
      const { name, amount, interval } = req.body;
      const plan = await paymentService.createPlan({ name, amount, interval });
      res.status(201).json(plan);
    } catch (error) {
      logger.error('Plan creation controller error:', error);
      next(error);
    }
  },

  // Subscribe user to plan
  subscribe: async (req, res, next) => {
    try {
      const { planCode } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const subscription = await paymentService.createSubscription({
        email: user.email,
        planCode,
        userId,
        subscriptionType: 'premium' // or whatever type
      });

      res.status(200).json(subscription);
    } catch (error) {
      logger.error('Subscription controller error:', error);
      next(error);
    }
  },

  // Process refund
  processRefund: async (req, res, next) => {
    try {
      const { transactionReference, reason } = req.body;
      const refund = await paymentService.processRefund({
        transactionReference,
        reason
      });

      res.status(200).json(refund);
    } catch (error) {
      logger.error('Refund controller error:', error);
      next(error);
    }
  },

  // Get payment analytics
  getAnalytics: async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const analytics = await paymentService.getAnalytics(startDate, endDate);
      res.status(200).json(analytics);
    } catch (error) {
      logger.error('Analytics controller error:', error);
      next(error);
    }
  },

  // Cancel subscription
  cancelSubscription: async (req, res, next) => {
    try {
      const { subscriptionCode } = req.params;
      const response = await paymentService.makeRequest(
        `/subscription/${subscriptionCode}/disable`,
        'POST'
      );

      // Update user's subscription status
      await User.findByIdAndUpdate(req.user.id, {
        subscribed: false
      });

      res.status(200).json(response.data);
    } catch (error) {
      logger.error('Subscription cancellation error:', error);
      next(error);
    }
  },

  // Get subscription details
  getSubscriptionDetails: async (req, res, next) => {
    try {
      const { subscriptionCode } = req.params;
      const response = await paymentService.makeRequest(
        `/subscription/${subscriptionCode}`,
        'GET'
      );

      res.status(200).json(response.data);
    } catch (error) {
      logger.error('Subscription details error:', error);
      next(error);
    }
  }
};