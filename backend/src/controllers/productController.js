import { Product } from '../models/Product.js';
import { logger } from '../utils/logger.js';

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    const filters = {
      sku: req.query.sku,
      lowStock: req.query.lowStock ? parseInt(req.query.lowStock) : undefined,
      limit: parseInt(req.query.limit) || 100
    };

    const products = await Product.findByUser(req.user.userId, filters);

    res.json({
      success: true,
      data: { products }
    });
  } catch (error) {
    logger.error('Get products error', { error: error.message });
    next(error);
  }
};

// Get inventory statistics
export const getInventoryStats = async (req, res, next) => {
  try {
    const stats = await Product.getInventoryStats(req.user.userId);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    logger.error('Get inventory stats error', { error: error.message });
    next(error);
  }
};

