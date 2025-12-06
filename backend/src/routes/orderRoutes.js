import express from 'express';
import { getOrders, getOrder, getOrderStats } from '../controllers/orderController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/:id', getOrder);

export default router;

