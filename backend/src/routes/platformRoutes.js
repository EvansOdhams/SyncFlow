import express from 'express';
import { body } from 'express-validator';
import {
  getPlatforms,
  getPlatform,
  connectWooCommerce,
  connectShopify,
  disconnectPlatform
} from '../controllers/platformController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Validation rules
const wooCommerceValidation = [
  body('storeUrl').isURL().withMessage('Valid store URL is required'),
  body('consumerKey').notEmpty().withMessage('Consumer key is required'),
  body('consumerSecret').notEmpty().withMessage('Consumer secret is required'),
  body('platformName').optional().trim().isLength({ min: 1, max: 255 })
];

const shopifyValidation = [
  body('shopDomain').notEmpty().withMessage('Shop domain is required'),
  body('accessToken').notEmpty().withMessage('Access token is required'),
  body('platformName').optional().trim().isLength({ min: 1, max: 255 })
];

// Routes
router.get('/', getPlatforms);
router.get('/:id', getPlatform);
router.post('/woocommerce', wooCommerceValidation, connectWooCommerce);
router.post('/shopify', shopifyValidation, connectShopify);
router.delete('/:id', disconnectPlatform);

export default router;

