import axios from 'axios';
import { logger } from '../utils/logger.js';

export class WooCommerceService {
  constructor(storeUrl, consumerKey, consumerSecret) {
    this.storeUrl = storeUrl.replace(/\/$/, ''); // Remove trailing slash
    this.consumerKey = consumerKey;
    this.consumerSecret = consumerSecret;
    this.baseURL = `${this.storeUrl}/wp-json/wc/v3`;
    
    // Basic Auth for WooCommerce REST API
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
    this.headers = {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    };
  }

  // Fetch all products
  async getProducts(perPage = 100, page = 1) {
    try {
      const response = await axios.get(`${this.baseURL}/products`, {
        headers: this.headers,
        params: { per_page: perPage, page }
      });
      return response.data;
    } catch (error) {
      logger.error('WooCommerce getProducts error', {
        error: error.message,
        storeUrl: this.storeUrl
      });
      throw error;
    }
  }

  // Get a single product
  async getProduct(productId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/products/${productId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      logger.error('WooCommerce getProduct error', {
        error: error.message,
        productId
      });
      throw error;
    }
  }

  // Update product stock
  async updateProductStock(productId, stockQuantity, manageStock = true) {
    try {
      const response = await axios.put(
        `${this.baseURL}/products/${productId}`,
        {
          manage_stock: manageStock,
          stock_quantity: stockQuantity
        },
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      logger.error('WooCommerce updateProductStock error', {
        error: error.message,
        productId,
        stockQuantity
      });
      throw error;
    }
  }

  // Get orders
  async getOrders(perPage = 100, page = 1, status = 'any') {
    try {
      const response = await axios.get(`${this.baseURL}/orders`, {
        headers: this.headers,
        params: { per_page: perPage, page, status }
      });
      return response.data;
    } catch (error) {
      logger.error('WooCommerce getOrders error', {
        error: error.message,
        storeUrl: this.storeUrl
      });
      throw error;
    }
  }

  // Get a single order
  async getOrder(orderId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/orders/${orderId}`,
        { headers: this.headers }
      );
      return response.data;
    } catch (error) {
      logger.error('WooCommerce getOrder error', {
        error: error.message,
        orderId
      });
      throw error;
    }
  }

  // Verify webhook signature (WooCommerce uses HMAC SHA256)
  static verifyWebhook(data, signature, secret) {
    const crypto = require('crypto');
    const hash = crypto
      .createHmac('sha256', secret)
      .update(data, 'utf8')
      .digest('base64');
    return hash === signature;
  }
}

