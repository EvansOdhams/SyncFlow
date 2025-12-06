import { query } from '../database/connection.js';
import { Platform } from '../models/Platform.js';
import { ShopifyService } from '../services/shopifyService.js';
import { WooCommerceService } from '../services/woocommerceService.js';
import { SyncService } from '../services/syncService.js';
import { logger } from '../utils/logger.js';

// Shopify webhook handler
export const handleShopifyWebhook = async (req, res, next) => {
  try {
    const shopDomain = req.get('X-Shopify-Shop-Domain');
    const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
    const topic = req.get('X-Shopify-Topic');

    if (!shopDomain || !hmacHeader) {
      return res.status(401).json({
        success: false,
        error: { message: 'Missing Shopify webhook headers' }
      });
    }

    // Find platform by shop domain
    const platforms = await query(
      `SELECT * FROM platforms WHERE platform_type = 'shopify' 
       AND api_credentials->>'shopDomain' = $1`,
      [shopDomain]
    );

    if (platforms.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Platform not found' }
      });
    }

    const platform = platforms.rows[0];
    const webhookSecret = process.env.SHOPIFY_WEBHOOK_SECRET || '';

    // Verify webhook signature
    const rawBody = JSON.stringify(req.body);
    const isValid = ShopifyService.verifyWebhook(rawBody, hmacHeader, webhookSecret);

    if (!isValid) {
      logger.warn('Invalid Shopify webhook signature', { shopDomain });
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid webhook signature' }
      });
    }

    // Store webhook event
    await query(
      `INSERT INTO webhook_events (platform_id, event_type, event_data, processed)
       VALUES ($1, $2, $3, false)`,
      [platform.id, topic, JSON.stringify(req.body)]
    );

    // Process webhook based on topic
    if (topic === 'orders/create' || topic === 'orders/updated') {
      await processOrderWebhook(req.body, platform);
    } else if (topic === 'inventory_levels/update') {
      await processInventoryWebhook(req.body, platform);
    }

    // Mark as processed
    await query(
      `UPDATE webhook_events SET processed = true, processed_at = CURRENT_TIMESTAMP
       WHERE platform_id = $1 AND event_type = $2
       ORDER BY created_at DESC LIMIT 1`,
      [platform.id, topic]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Shopify webhook error', { error: error.message });
    next(error);
  }
};

// WooCommerce webhook handler
export const handleWooCommerceWebhook = async (req, res, next) => {
  try {
    const storeUrl = req.get('X-WC-Webhook-Source');
    const signature = req.get('X-WC-Webhook-Signature');

    if (!storeUrl) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing WooCommerce webhook headers' }
      });
    }

    // Find platform by store URL
    const platforms = await query(
      `SELECT * FROM platforms WHERE platform_type = 'woocommerce' 
       AND api_credentials->>'storeUrl' = $1`,
      [storeUrl]
    );

    if (platforms.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: { message: 'Platform not found' }
      });
    }

    const platform = platforms.rows[0];
    const eventType = req.body.action || 'unknown';

    // Store webhook event
    await query(
      `INSERT INTO webhook_events (platform_id, event_type, event_data, processed)
       VALUES ($1, $2, $3, false)`,
      [platform.id, eventType, JSON.stringify(req.body)]
    );

    // Process webhook
    if (eventType === 'created' && req.body.resource === 'order') {
      await processOrderWebhook(req.body, platform);
    } else if (eventType === 'updated' && req.body.resource === 'product') {
      await processInventoryWebhook(req.body, platform);
    }

    // Mark as processed
    await query(
      `UPDATE webhook_events SET processed = true, processed_at = CURRENT_TIMESTAMP
       WHERE platform_id = $1 AND event_type = $2
       ORDER BY created_at DESC LIMIT 1`,
      [platform.id, eventType]
    );

    res.status(200).json({ success: true });
  } catch (error) {
    logger.error('WooCommerce webhook error', { error: error.message });
    next(error);
  }
};

// Process order webhook
async function processOrderWebhook(orderData, platform) {
  try {
    const order = orderData.order || orderData;
    const userId = (await query(
      'SELECT user_id FROM platforms WHERE id = $1',
      [platform.id]
    )).rows[0].user_id;

    // Store order in database
    await query(
      `INSERT INTO orders (user_id, platform_id, order_number, platform_order_id, 
                          status, total, currency, customer_email, customer_name, 
                          shipping_address, order_items, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (platform_id, platform_order_id) DO UPDATE SET
         status = EXCLUDED.status,
         total = EXCLUDED.total,
         updated_at = CURRENT_TIMESTAMP`,
      [
        userId,
        platform.id,
        order.order_number || order.number || order.id.toString(),
        order.id.toString(),
        order.financial_status || order.status || 'pending',
        parseFloat(order.total || order.total_price || 0),
        order.currency || 'USD',
        order.email || order.customer?.email || null,
        order.customer?.first_name || order.billing?.first_name || null,
        JSON.stringify(order.shipping_address || order.shipping || {}),
        JSON.stringify(order.line_items || order.items || []),
        order.financial_status || order.payment_status || 'pending'
      ]
    );

    // Trigger inventory sync if needed
    const syncService = new SyncService(userId);
    const platforms = await syncService.getActivePlatforms();
    if (platforms.length > 1) {
      // Sync inventory after order
      logger.info('Triggering inventory sync after order', { orderId: order.id });
    }
  } catch (error) {
    logger.error('Process order webhook error', { error: error.message });
    throw error;
  }
}

// Process inventory webhook
async function processInventoryWebhook(inventoryData, platform) {
  try {
    const userId = (await query(
      'SELECT user_id FROM platforms WHERE id = $1',
      [platform.id]
    )).rows[0].user_id;

    // Trigger sync to other platforms
    const syncService = new SyncService(userId);
    const platforms = await syncService.getActivePlatforms();
    
    if (platforms.length > 1) {
      // Sync inventory to other platforms
      logger.info('Triggering inventory sync after webhook', { platformId: platform.id });
    }
  } catch (error) {
    logger.error('Process inventory webhook error', { error: error.message });
    throw error;
  }
}

