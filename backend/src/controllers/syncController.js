import { SyncService } from '../services/syncService.js';
import { logger } from '../utils/logger.js';

// Sync inventory between two platforms
export const syncPlatforms = async (req, res, next) => {
  try {
    const { sourcePlatformId, targetPlatformId } = req.body;

    if (!sourcePlatformId || !targetPlatformId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Source and target platform IDs are required' }
      });
    }

    const syncService = new SyncService(req.user.userId);
    const result = await syncService.syncInventoryBetweenPlatforms(
      sourcePlatformId,
      targetPlatformId
    );

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Sync platforms error', { error: error.message });
    next(error);
  }
};

// Sync all platforms
export const syncAll = async (req, res, next) => {
  try {
    const syncService = new SyncService(req.user.userId);
    const results = await syncService.syncAllPlatforms();

    res.json({
      success: true,
      data: { results }
    });
  } catch (error) {
    logger.error('Sync all error', { error: error.message });
    next(error);
  }
};

// Get sync history
export const getSyncHistory = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const syncService = new SyncService(req.user.userId);
    const history = await syncService.getSyncHistory(limit);

    res.json({
      success: true,
      data: { history }
    });
  } catch (error) {
    logger.error('Get sync history error', { error: error.message });
    next(error);
  }
};

