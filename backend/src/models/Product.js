import { query } from '../database/connection.js';

export class Product {
  static async create(productData) {
    const { userId, sku, name, description, currentStock } = productData;
    const result = await query(
      `INSERT INTO products (user_id, sku, name, description, current_stock)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id, sku) DO UPDATE SET
         name = EXCLUDED.name,
         description = EXCLUDED.description,
         current_stock = EXCLUDED.current_stock,
         updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, sku, name, description || null, currentStock || 0]
    );
    return result.rows[0];
  }

  static async findByUser(userId, filters = {}) {
    let sql = `
      SELECT p.*, 
             COUNT(DISTINCT pp.platform_id) as platform_count
      FROM products p
      LEFT JOIN product_platforms pp ON p.id = pp.product_id
      WHERE p.user_id = $1
    `;
    const params = [userId];
    let paramCount = 2;

    if (filters.sku) {
      sql += ` AND p.sku ILIKE $${paramCount++}`;
      params.push(`%${filters.sku}%`);
    }

    if (filters.lowStock !== undefined) {
      sql += ` AND p.current_stock <= $${paramCount++}`;
      params.push(filters.lowStock);
    }

    sql += ` GROUP BY p.id ORDER BY p.created_at DESC`;

    if (filters.limit) {
      sql += ` LIMIT $${paramCount++}`;
      params.push(filters.limit);
    } else {
      sql += ` LIMIT 100`;
    }

    const result = await query(sql, params);
    return result.rows;
  }

  static async getInventoryStats(userId) {
    const result = await query(
      `SELECT 
        COUNT(*) as total_products,
        SUM(current_stock) as total_stock,
        COUNT(CASE WHEN current_stock = 0 THEN 1 END) as out_of_stock,
        COUNT(CASE WHEN current_stock > 0 AND current_stock <= 10 THEN 1 END) as low_stock
      FROM products
      WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0];
  }
}

