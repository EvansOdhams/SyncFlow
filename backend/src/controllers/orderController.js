import { Order } from '../models/Order.js';
import { logger } from '../utils/logger.js';

// Get all orders for user
export const getOrders = async (req, res, next) => {
  try {
    const filters = {
      status: req.query.status,
      platformId: req.query.platformId,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      limit: parseInt(req.query.limit) || 50,
      offset: parseInt(req.query.offset) || 0
    };

    const orders = await Order.findByUser(req.user.userId, filters);

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    logger.error('Get orders error', { error: error.message });
    next(error);
  }
};

// Get single order
export const getOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id, req.user.userId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: { message: 'Order not found' }
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    logger.error('Get order error', { error: error.message });
    next(error);
  }
};

// Get order statistics
export const getOrderStats = async (req, res, next) => {
  try {
    const filters = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const stats = await Order.getOrderStats(req.user.userId, filters);

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    logger.error('Get order stats error', { error: error.message });
    next(error);
  }
};

