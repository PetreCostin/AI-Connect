require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware - adds various HTTP headers for security
app.use(helmet());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Body parser middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting to prevent abuse
// Limits each IP to specified number of requests per window
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply rate limiting to all API routes
app.use('/api/', limiter);

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api', chatRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'AI Connect Backend API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      chat: 'POST /api/chat',
      health: 'GET /api/health'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`AI Connect Backend Server`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Server running on port ${PORT}`);
  console.log(`Access at: http://localhost:${PORT}`);
  console.log('='.repeat(50));
  
  // Check if watsonx is configured
  const watsonxService = require('./services/watsonx');
  if (watsonxService.isConfigured()) {
    console.log('✓ watsonx service is configured');
  } else {
    console.warn('⚠ Warning: watsonx API credentials not configured');
    console.warn('  Please set WATSONX_API_KEY and WATSONX_PROJECT_ID in .env file');
  }
  console.log('='.repeat(50));
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;
