require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');

const tryonRoutes = require('./routes/tryon');
const studioRoutes = require('./routes/studio');
const productRoutes = require('./routes/product');
const healthRoutes = require('./routes/health');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Security ───
app.use(helmet());
app.use(compression());

// ─── CORS ───
const allowedOrigins = process.env.ALLOWED_ORIGINS === '*'
  ? '*'
  : process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body parsing ───
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// ─── Logging ───
app.use(morgan('combined', {
  stream: { write: msg => logger.info(msg.trim()) },
}));

// ─── Rate limiting ───
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter limit for AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 10,
  message: { error: 'AI request limit reached. Please wait a moment.' },
});
app.use('/api/tryon', aiLimiter);
app.use('/api/studio', aiLimiter);

// ─── Routes ───
app.use('/health', healthRoutes);
app.use('/api/tryon', tryonRoutes);
app.use('/api/studio', studioRoutes);
app.use('/api/product', productRoutes);

// ─── 404 handler ───
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global error handler ───
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

// ─── Start server ───
app.listen(PORT, () => {
  logger.info(`🚀 Lookr backend running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.includes('REPLACE')) {
    logger.warn('⚠️  ANTHROPIC_API_KEY not set! Set it in your .env file.');
  } else {
    logger.info('✅ Anthropic API key detected');
  }
});

module.exports = app;
