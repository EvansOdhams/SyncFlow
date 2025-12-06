import express from 'express';
import { handleShopifyWebhook, handleWooCommerceWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Webhook routes (no authentication - they use signature verification)
router.post('/shopify', express.raw({ type: 'application/json' }), handleShopifyWebhook);
router.post('/woocommerce', express.json(), handleWooCommerceWebhook);

export default router;

