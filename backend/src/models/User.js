import { query } from '../database/connection.js';

export class User {
  static async create(userData) {
    const { email, passwordHash, firstName, lastName } = userData;
    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, first_name, last_name, subscription_tier, created_at`,
      [email, passwordHash, firstName || null, lastName || null]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      `SELECT id, email, password_hash, first_name, last_name, 
              subscription_tier, is_active, created_at, updated_at
       FROM users WHERE email = $1`,
      [email]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await query(
      `SELECT id, email, first_name, last_name, subscription_tier, 
              is_active, created_at, updated_at
       FROM users WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async update(id, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.firstName !== undefined) {
      fields.push(`first_name = $${paramCount++}`);
      values.push(updates.firstName);
    }
    if (updates.lastName !== undefined) {
      fields.push(`last_name = $${paramCount++}`);
      values.push(updates.lastName);
    }
    if (updates.subscriptionTier !== undefined) {
      fields.push(`subscription_tier = $${paramCount++}`);
      values.push(updates.subscriptionTier);
    }
    if (updates.isActive !== undefined) {
      fields.push(`is_active = $${paramCount++}`);
      values.push(updates.isActive);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount}
       RETURNING id, email, first_name, last_name, subscription_tier, is_active, updated_at`,
      values
    );
    return result.rows[0];
  }
}

