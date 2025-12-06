import { validationResult } from 'express-validator';
import { Platform } from '../models/Platform.js';
import { ShopifyService } from '../services/shopifyService.js';
import { WooCommerceService } from '../services/woocommerceService.js';
import { logger } from '../utils/logger.js';

// Get all platforms for user
export const getPlatforms = async (req, res, next) => {
  try {
    const platforms = await Platform.findByUser(req.user.userId);
    res.json({
      success: true,
      data: { platforms }
    });
  } catch (error) {
    logger.error('Get platforms error', { error: error.message });
    next(error);
  }
};

// Get single platform
export const getPlatform = async (req, res, next) => {
  try {
    const { id } = req.params;
    const platform = await Platform.findById(id, req.user.userId);
    
    if (!platform) {
      return res.status(404).json({
        success: false,
        error: { message: 'Platform not found' }
      });
    }

    res.json({
      success: true,
      data: { platform }
    });
  } catch (error) {
    logger.error('Get platform error', { error: error.message });
    next(error);
  }
};

// Connect WooCommerce platform
export const connectWooCommerce = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { storeUrl, consumerKey, consumerSecret, platformName } = req.body;

    // Test connection
    const wcService = new WooCommerceService(storeUrl, consumerKey, consumerSecret);
    try {
      await wcService.getProducts(1, 1); // Test with minimal request
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: { message: 'Failed to connect to WooCommerce store. Please check your credentials.' }
      });
    }

    // Save platform
    const platform = await Platform.create({
      userId: req.user.userId,
      platformType: 'woocommerce',
      platformName: platformName || storeUrl,
      apiCredentials: {
        storeUrl,
        consumerKey,
        consumerSecret
      },
      status: 'active'
    });

    logger.info('WooCommerce platform connected', {
      userId: req.user.userId,
      platformId: platform.id
    });

    res.status(201).json({
      success: true,
      data: { platform }
    });
  } catch (error) {
    logger.error('Connect WooCommerce error', { error: error.message });
    next(error);
  }
};

// Connect Shopify platform (OAuth will be handled separately)
export const connectShopify = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { shopDomain, accessToken, platformName } = req.body;

    // Test connection
    const shopifyService = new ShopifyService(shopDomain, accessToken);
    try {
      await shopifyService.getProducts(1); // Test with minimal request
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: { message: 'Failed to connect to Shopify store. Please check your credentials.' }
      });
    }

    // Save platform
    const platform = await Platform.create({
      userId: req.user.userId,
      platformType: 'shopify',
      platformName: platformName || shopDomain,
      apiCredentials: {
        shopDomain,
        accessToken
      },
      status: 'active'
    });

    logger.info('Shopify platform connected', {
      userId: req.user.userId,
      platformId: platform.id
    });

    res.status(201).json({
      success: true,
      data: { platform }
    });
  } catch (error) {
    logger.error('Connect Shopify error', { error: error.message });
    next(error);
  }
};

// Disconnect platform
export const disconnectPlatform = async (req, res, next) => {
  try {
    const { id } = req.params;
    const platform = await Platform.delete(id, req.user.userId);
    
    if (!platform) {
      return res.status(404).json({
        success: false,
        error: { message: 'Platform not found' }
      });
    }

    logger.info('Platform disconnected', {
      userId: req.user.userId,
      platformId: id
    });

    res.json({
      success: true,
      message: 'Platform disconnected successfully'
    });
  } catch (error) {
    logger.error('Disconnect platform error', { error: error.message });
    next(error);
  }
};

