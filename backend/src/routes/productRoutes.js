import express from 'express';
import { getProducts, getInventoryStats } from '../controllers/productController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.get('/', getProducts);
router.get('/stats', getInventoryStats);

export default router;

