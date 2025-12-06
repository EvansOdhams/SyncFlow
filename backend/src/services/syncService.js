import { query } from '../database/connection.js';
import { Platform } from '../models/Platform.js';
import { ShopifyService } from './shopifyService.js';
import { WooCommerceService } from './woocommerceService.js';
import { logger } from '../utils/logger.js';

export class SyncService {
  constructor(userId) {
    this.userId = userId;
  }

  // Get all active platforms for user
  async getActivePlatforms() {
    const platforms = await Platform.findByUser(this.userId);
    return platforms.filter(p => p.status === 'active');
  }

  // Sync inventory from one platform to another
  async syncInventoryBetweenPlatforms(sourcePlatformId, targetPlatformId) {
    const startTime = Date.now();
    let itemsSynced = 0;
    let itemsFailed = 0;
    const errors = [];

    try {
      // Get platform details
      const sourcePlatform = await Platform.findById(sourcePlatformId, this.userId);
      const targetPlatform = await Platform.findById(targetPlatformId, this.userId);

      if (!sourcePlatform || !targetPlatform) {
        throw new Error('One or both platforms not found');
      }

      // Get products from source platform
      let sourceProducts = [];
      if (sourcePlatform.platform_type === 'shopify') {
        const shopifyService = new ShopifyService(
          sourcePlatform.api_credentials.shopDomain,
          sourcePlatform.api_credentials.accessToken
        );
        sourceProducts = await shopifyService.getProducts();
      } else if (sourcePlatform.platform_type === 'woocommerce') {
        const wcService = new WooCommerceService(
          sourcePlatform.api_credentials.storeUrl,
          sourcePlatform.api_credentials.consumerKey,
          sourcePlatform.api_credentials.consumerSecret
        );
        sourceProducts = await wcService.getProducts();
      }

      // Sync each product to target platform
      for (const product of sourceProducts) {
        try {
          if (targetPlatform.platform_type === 'shopify') {
            await this.syncToShopify(product, targetPlatform, sourcePlatform);
          } else if (targetPlatform.platform_type === 'woocommerce') {
            await this.syncToWooCommerce(product, targetPlatform, sourcePlatform);
          }
          itemsSynced++;
        } catch (error) {
          itemsFailed++;
          errors.push({ product: product.id || product.sku, error: error.message });
          logger.error('Product sync failed', {
            productId: product.id,
            error: error.message
          });
        }
      }

      // Update last sync time
      await Platform.update(sourcePlatformId, this.userId, {
        lastSyncAt: new Date()
      });
      await Platform.update(targetPlatformId, this.userId, {
        lastSyncAt: new Date()
      });

      // Log sync operation
      const duration = Date.now() - startTime;
      await this.logSync({
        platformId: sourcePlatformId,
        syncType: 'inventory',
        status: itemsFailed === 0 ? 'success' : itemsFailed < itemsSynced ? 'partial' : 'failed',
        itemsSynced,
        itemsFailed,
        durationMs: duration,
        errorMessage: errors.length > 0 ? JSON.stringify(errors) : null
      });

      return {
        success: true,
        itemsSynced,
        itemsFailed,
        duration: duration,
        errors: errors.length > 0 ? errors : null
      };
    } catch (error) {
      logger.error('Sync failed', { error: error.message });
      const duration = Date.now() - startTime;
      await this.logSync({
        platformId: sourcePlatformId,
        syncType: 'inventory',
        status: 'failed',
        itemsSynced: 0,
        itemsFailed: 0,
        durationMs: duration,
        errorMessage: error.message
      });
      throw error;
    }
  }

  // Sync product to Shopify
  async syncToShopify(product, targetPlatform, sourcePlatform) {
    const shopifyService = new ShopifyService(
      targetPlatform.api_credentials.shopDomain,
      targetPlatform.api_credentials.accessToken
    );

    // Get inventory level from source
    let stockQuantity = 0;
    if (sourcePlatform.platform_type === 'woocommerce') {
      stockQuantity = product.stock_quantity || 0;
    } else if (sourcePlatform.platform_type === 'shopify') {
      // For Shopify, we'd need to get inventory levels separately
      stockQuantity = product.variants?.[0]?.inventory_quantity || 0;
    }

    // Update inventory in Shopify
    // Note: This is simplified - in production, you'd need to map products properly
    if (product.variants && product.variants.length > 0) {
      for (const variant of product.variants) {
        if (variant.inventory_item_id && variant.inventory_quantity !== undefined) {
          // Get location ID (simplified - you'd get this from platform settings)
          const locationId = targetPlatform.api_credentials.locationId || null;
          if (locationId) {
            await shopifyService.updateInventoryLevel(
              variant.inventory_item_id,
              locationId,
              stockQuantity
            );
          }
        }
      }
    }
  }

  // Sync product to WooCommerce
  async syncToWooCommerce(product, targetPlatform, sourcePlatform) {
    const wcService = new WooCommerceService(
      targetPlatform.api_credentials.storeUrl,
      targetPlatform.api_credentials.consumerKey,
      targetPlatform.api_credentials.consumerSecret
    );

    // Get stock quantity from source
    let stockQuantity = 0;
    if (sourcePlatform.platform_type === 'woocommerce') {
      stockQuantity = product.stock_quantity || 0;
    } else if (sourcePlatform.platform_type === 'shopify') {
      stockQuantity = product.variants?.[0]?.inventory_quantity || 0;
    }

    // Find or create product in WooCommerce by SKU
    const sku = product.sku || product.variants?.[0]?.sku;
    if (sku) {
      // In production, you'd search for existing product by SKU first
      // For now, we'll assume product ID mapping exists
      const wcProductId = product.wc_product_id || product.id;
      if (wcProductId) {
        await wcService.updateProductStock(wcProductId, stockQuantity);
      }
    }
  }

  // Sync all platforms (bidirectional)
  async syncAllPlatforms() {
    const platforms = await this.getActivePlatforms();
    
    if (platforms.length < 2) {
      throw new Error('Need at least 2 active platforms to sync');
    }

    const results = [];
    
    // Sync between all platform pairs
    for (let i = 0; i < platforms.length; i++) {
      for (let j = i + 1; j < platforms.length; j++) {
        try {
          const result = await this.syncInventoryBetweenPlatforms(
            platforms[i].id,
            platforms[j].id
          );
          results.push({
            source: platforms[i].platform_type,
            target: platforms[j].platform_type,
            ...result
          });
        } catch (error) {
          results.push({
            source: platforms[i].platform_type,
            target: platforms[j].platform_type,
            success: false,
            error: error.message
          });
        }
      }
    }

    return results;
  }

  // Log sync operation
  async logSync(logData) {
    await query(
      `INSERT INTO sync_logs (user_id, platform_id, sync_type, status, items_synced, items_failed, error_message, duration_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        this.userId,
        logData.platformId,
        logData.syncType,
        logData.status,
        logData.itemsSynced,
        logData.itemsFailed,
        logData.errorMessage,
        logData.durationMs
      ]
    );
  }

  // Get sync history
  async getSyncHistory(limit = 50) {
    const result = await query(
      `SELECT sl.*, p.platform_type, p.platform_name
       FROM sync_logs sl
       LEFT JOIN platforms p ON sl.platform_id = p.id
       WHERE sl.user_id = $1
       ORDER BY sl.created_at DESC
       LIMIT $2`,
      [this.userId, limit]
    );
    return result.rows;
  }
}

