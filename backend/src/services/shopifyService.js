import axios from 'axios';
import { logger } from '../utils/logger.js';

export class ShopifyService {
  constructor(shopDomain, accessToken) {
    this.shopDomain = shopDomain;
    this.accessToken = accessToken;
    this.baseURL = `https://${shopDomain}.myshopify.com/admin/api/2024-01`;
    this.headers = {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json'
    };
  }

  // Fetch all products
  async getProducts(limit = 250) {
    try {
      const response = await axios.get(`${this.baseURL}/products.json`, {
        headers: this.headers,
        params: { limit }
      });
      return response.data.products;
    } catch (error) {
      logger.error('Shopify getProducts error', {
        error: error.message,
        shopDomain: this.shopDomain
      });
      throw error;
    }
  }

  // Get product inventory levels
  async getInventoryLevels(locationIds = []) {
    try {
      const params = {};
      if (locationIds.length > 0) {
        params.location_ids = locationIds.join(',');
      }

      const response = await axios.get(`${this.baseURL}/inventory_levels.json`, {
        headers: this.headers,
        params
      });
      return response.data.inventory_levels;
    } catch (error) {
      logger.error('Shopify getInventoryLevels error', {
        error: error.message,
        shopDomain: this.shopDomain
      });
      throw error;
    }
  }

  // Update inventory level
  async updateInventoryLevel(inventoryItemId, locationId, available) {
    try {
      const response = await axios.post(
        `${this.baseURL}/inventory_levels/set.json`,
        {
          location_id: locationId,
          inventory_item_id: inventoryItemId,
          available: available
        },
        { headers: this.headers }
      );
      return response.data.inventory_level;
    } catch (error) {
      logger.error('Shopify updateInventoryLevel error', {
        error: error.message,
        inventoryItemId,
        locationId
      });
      throw error;
    }
  }

  // Get orders
  async getOrders(limit = 250, status = 'any') {
    try {
      const response = await axios.get(`${this.baseURL}/orders.json`, {
        headers: this.headers,
        params: { limit, status }
      });
      return response.data.orders;
    } catch (error) {
      logger.error('Shopify getOrders error', {
        error: error.message,
        shopDomain: this.shopDomain
      });
      throw error;
    }
  }

  // Get a single order
  async getOrder(orderId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/orders/${orderId}.json`,
        { headers: this.headers }
      );
      return response.data.order;
    } catch (error) {
      logger.error('Shopify getOrder error', {
        error: error.message,
        orderId
      });
      throw error;
    }
  }

  // Verify webhook signature
  static verifyWebhook(data, hmacHeader, secret) {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', secret)
      .update(data, 'utf8')
      .digest('base64');
    return hash === hmacHeader;
  }
}

