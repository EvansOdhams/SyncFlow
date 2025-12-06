import express from 'express';
import { handleShopifyWebhook, handleWooCommerceWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Middleware to capture raw body for Shopify webhook verification
const rawBodyParser = express.raw({ type: 'application/json', limit: '10mb' });

// Webhook routes (no authentication - they use signature verification)
router.post('/shopify', rawBodyParser, (req, res, next) => {
  // Parse JSON from raw body
  try {
    req.body = JSON.parse(req.body.toString());
  } catch (e) {
    return res.status(400).json({ success: false, error: { message: 'Invalid JSON' } });
  }
  handleShopifyWebhook(req, res, next);
});

router.post('/woocommerce', express.json(), handleWooCommerceWebhook);

export default router;

