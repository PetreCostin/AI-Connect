const express = require('express');
const router = express.Router();
const watsonxService = require('../services/watsonx');

/**
 * Input validation and sanitization middleware
 */
const validateMessage = (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ 
      error: 'Message is required',
      success: false 
    });
  }

  if (typeof message !== 'string') {
    return res.status(400).json({ 
      error: 'Message must be a string',
      success: false 
    });
  }

  // Trim and check length
  const trimmedMessage = message.trim();
  
  if (trimmedMessage.length === 0) {
    return res.status(400).json({ 
      error: 'Message cannot be empty',
      success: false 
    });
  }

  if (trimmedMessage.length > 2000) {
    return res.status(400).json({ 
      error: 'Message is too long (max 2000 characters)',
      success: false 
    });
  }

  // Sanitize the message (remove potentially harmful characters)
  req.body.message = trimmedMessage.replace(/[<>]/g, '');
  
  next();
};

/**
 * POST /api/chat
 * Send a message to the AI chatbot and receive a response
 * 
 * Request body:
 * {
 *   "message": "User's question or message",
 *   "options": {  // Optional
 *     "maxTokens": 500,
 *     "temperature": 0.7
 *   }
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "response": "AI-generated response text",
 *   "timestamp": "2024-01-30T12:00:00.000Z"
 * }
 */
router.post('/chat', validateMessage, async (req, res) => {
  const { message, options } = req.body;

  try {
    // Check if watsonx is configured
    if (!watsonxService.isConfigured()) {
      return res.status(503).json({
        success: false,
        error: 'AI service is not configured. Please set up watsonx API credentials.',
        timestamp: new Date().toISOString()
      });
    }

    // Log the incoming request (for debugging)
    console.log(`[${new Date().toISOString()}] Received message: ${message.substring(0, 50)}...`);

    // Send message to watsonx and get response
    const aiResponse = await watsonxService.sendMessage(message, options);

    // Log successful response
    console.log(`[${new Date().toISOString()}] Generated response: ${aiResponse.substring(0, 50)}...`);

    // Return success response
    res.json({
      success: true,
      response: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    // Log error
    console.error(`[${new Date().toISOString()}] Error processing chat:`, error.message);

    // Return error response
    res.status(500).json({
      success: false,
      error: error.message || 'An error occurred processing your request',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/health
 * Check if the API and watsonx service are operational
 */
router.get('/health', (req, res) => {
  const isConfigured = watsonxService.isConfigured();
  
  res.json({
    success: true,
    status: isConfigured ? 'operational' : 'not_configured',
    message: isConfigured 
      ? 'Chat service is ready' 
      : 'watsonx credentials not configured',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
