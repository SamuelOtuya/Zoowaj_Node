import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Admin routes
router.post('/plans', adminMiddleware, PaymentController.createPlan);
router.get('/analytics', adminMiddleware, PaymentController.getAnalytics);

// User routes
router.post('/subscribe', authMiddleware, PaymentController.subscribe);
router.post('/refund', authMiddleware, PaymentController.processRefund);
router.get('/subscription/:subscriptionCode', authMiddleware, PaymentController.getSubscriptionDetails);
router.post('/subscription/:subscriptionCode/cancel', authMiddleware, PaymentController.cancelSubscription);

export default router;