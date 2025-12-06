import { query } from '../database/connection.js';

export class Order {
  static async create(orderData) {
    const {
      userId,
      platformId,
      orderNumber,
      platformOrderId,
      status,
      total,
      currency,
      customerEmail,
      customerName,
      shippingAddress,
      orderItems,
      paymentStatus
    } = orderData;

    const result = await query(
      `INSERT INTO orders (user_id, platform_id, order_number, platform_order_id, 
                          status, total, currency, customer_email, customer_name,
                          shipping_address, order_items, payment_status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [
        userId,
        platformId,
        orderNumber,
        platformOrderId,
        status || 'pending',
        total,
        currency || 'USD',
        customerEmail || null,
        customerName || null,
        JSON.stringify(shippingAddress || {}),
        JSON.stringify(orderItems || []),
        paymentStatus || 'pending'
      ]
    );
    return result.rows[0];
  }

  static async findByUser(userId, filters = {}) {
    let sql = `
      SELECT o.*, p.platform_type, p.platform_name
      FROM orders o
      JOIN platforms p ON o.platform_id = p.id
      WHERE o.user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (filters.status) {
      sql += ` AND o.status = $${paramCount++}`;
      params.push(filters.status);
    }

    if (filters.platformId) {
      sql += ` AND o.platform_id = $${paramCount++}`;
      params.push(filters.platformId);
    }

    if (filters.startDate) {
      sql += ` AND o.created_at >= $${paramCount++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      sql += ` AND o.created_at <= $${paramCount++}`;
      params.push(filters.endDate);
    }

    sql += ` ORDER BY o.created_at DESC`;

    if (filters.limit) {
      sql += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    } else {
      sql += ` LIMIT 100`;
    }

    if (filters.offset) {
      sql += ` OFFSET $${paramCount++}`;
      params.push(filters.offset);
    }

    const result = await query(sql, params);
    return result.rows.map(row => ({
      ...row,
      shipping_address: typeof row.shipping_address === 'string' 
        ? JSON.parse(row.shipping_address) 
        : row.shipping_address,
      order_items: typeof row.order_items === 'string'
        ? JSON.parse(row.order_items)
        : row.order_items
    }));
  }

  static async findById(id, userId) {
    const result = await query(
      `SELECT o.*, p.platform_type, p.platform_name
       FROM orders o
       JOIN platforms p ON o.platform_id = p.id
       WHERE o.id = $1 AND o.user_id = $2`,
      [id, userId]
    );
    if (result.rows[0]) {
      const order = result.rows[0];
      order.shipping_address = typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address;
      order.order_items = typeof order.order_items === 'string'
        ? JSON.parse(order.order_items)
        : order.order_items;
    }
    return result.rows[0];
  }

  static async getOrderStats(userId, filters = {}) {
    let sql = `
      SELECT 
        COUNT(*) as total_orders,
        SUM(total) as total_revenue,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_orders,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders
      FROM orders
      WHERE user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (filters.startDate) {
      sql += ` AND created_at >= $${paramCount++}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      sql += ` AND created_at <= $${paramCount++}`;
      params.push(filters.endDate);
    }

    const result = await query(sql, params);
    return result.rows[0];
  }
}

