import { query } from '../database/connection.js';

export class Platform {
  static async create(platformData) {
    const { userId, platformType, platformName, apiCredentials, status = 'active' } = platformData;
    const result = await query(
      `INSERT INTO platforms (user_id, platform_type, platform_name, api_credentials, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, platform_type, platform_name, status, last_sync_at, created_at`,
      [userId, platformType, platformName, JSON.stringify(apiCredentials), status]
    );
    return result.rows[0];
  }

  static async findByUser(userId) {
    const result = await query(
      `SELECT id, user_id, platform_type, platform_name, status, last_sync_at, created_at, updated_at
       FROM platforms WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async findById(id, userId) {
    const result = await query(
      `SELECT id, user_id, platform_type, platform_name, api_credentials, status, 
              last_sync_at, created_at, updated_at
       FROM platforms WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    if (result.rows[0]) {
      result.rows[0].api_credentials = JSON.parse(result.rows[0].api_credentials);
    }
    return result.rows[0];
  }

  static async update(id, userId, updates) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updates.apiCredentials !== undefined) {
      fields.push(`api_credentials = $${paramCount++}`);
      values.push(JSON.stringify(updates.apiCredentials));
    }
    if (updates.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updates.status);
    }
    if (updates.lastSyncAt !== undefined) {
      fields.push(`last_sync_at = $${paramCount++}`);
      values.push(updates.lastSyncAt);
    }

    if (fields.length === 0) return null;

    values.push(id, userId);
    const result = await query(
      `UPDATE platforms SET ${fields.join(', ')} 
       WHERE id = $${paramCount} AND user_id = $${paramCount + 1}
       RETURNING id, user_id, platform_type, platform_name, status, last_sync_at, updated_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id, userId) {
    const result = await query(
      `DELETE FROM platforms WHERE id = $1 AND user_id = $2 RETURNING id`,
      [id, userId]
    );
    return result.rows[0];
  }
}

