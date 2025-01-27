import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Protected routes
router.post('/initialize', authMiddleware, PaymentController.initializePayment);
router.get('/verify', authMiddleware, PaymentController.verifyPayment);
router.get('/history', authMiddleware, PaymentController.getPaymentHistory);

// Webhook doesn't need auth middleware
router.post('/webhook', PaymentController.handleWebhook);

export default router;