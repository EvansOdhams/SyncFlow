import express from 'express';
import { syncPlatforms, syncAll, getSyncHistory } from '../controllers/syncController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Routes
router.post('/platforms', syncPlatforms);
router.post('/all', syncAll);
router.get('/history', getSyncHistory);

export default router;

