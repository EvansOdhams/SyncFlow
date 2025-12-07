import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { logger } from './utils/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

// Load environment variables
dotenv.config();

const app = express();
// Render and other platforms provide PORT, fallback to 3001 for local
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration - support multiple origins
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SyncFlow Backend API'
  });
});

// API routes
import authRoutes from './routes/authRoutes.js';
import platformRoutes from './routes/platformRoutes.js';
import syncRoutes from './routes/syncRoutes.js';
import webhookRoutes from './routes/webhookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/platforms', platformRoutes);
app.use('/api/v1/sync', syncRoutes);
app.use('/api/v1/webhooks', webhookRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/products', productRoutes);

app.get('/api/v1', (req, res) => {
  res.json({
    message: 'SyncFlow API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/v1/auth/register',
        login: 'POST /api/v1/auth/login',
        me: 'GET /api/v1/auth/me'
      },
      platforms: {
        list: 'GET /api/v1/platforms',
        get: 'GET /api/v1/platforms/:id',
        connectWooCommerce: 'POST /api/v1/platforms/woocommerce',
        connectShopify: 'POST /api/v1/platforms/shopify',
        disconnect: 'DELETE /api/v1/platforms/:id'
      },
      sync: {
        syncPlatforms: 'POST /api/v1/sync/platforms',
        syncAll: 'POST /api/v1/sync/all',
        history: 'GET /api/v1/sync/history'
      },
      webhooks: {
        shopify: 'POST /api/v1/webhooks/shopify',
        woocommerce: 'POST /api/v1/webhooks/woocommerce'
      },
      orders: {
        list: 'GET /api/v1/orders',
        get: 'GET /api/v1/orders/:id',
        stats: 'GET /api/v1/orders/stats'
      },
      products: {
        list: 'GET /api/v1/products',
        stats: 'GET /api/v1/products/stats'
      }
    }
  });
});

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 SyncFlow Backend Server running on port ${PORT}`);
  logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

