# AI Connect - Intelligent Chatbot Application

A modern, enterprise-grade AI chatbot web application that integrates React frontend with Node.js backend and IBM watsonx AI for intelligent compliance and support automation.

![AI Connect](https://img.shields.io/badge/AI-watsonx-blue)
![React](https://img.shields.io/badge/React-18.2-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![License](https://img.shields.io/badge/license-MIT-brightgreen)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Apache Deployment](#apache-deployment)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

AI Connect is a full-stack chatbot application designed to demonstrate enterprise AI integration patterns. It provides an intuitive chat interface powered by IBM watsonx for intelligent responses to compliance and support queries.

### Key Components:
- **Frontend**: Modern React-based chat interface with real-time messaging
- **Backend**: Robust Node.js/Express API server with security features
- **AI Engine**: IBM watsonx integration for natural language processing
- **Deployment**: Apache-ready configuration for production environments

## ✨ Features

### Frontend Features
- ✅ Modern, responsive chat interface
- ✅ Real-time message history
- ✅ Typing indicators for AI responses
- ✅ Sample prompts for quick questions
- ✅ Clear chat functionality
- ✅ Message timestamps
- ✅ Error handling with user-friendly messages
- ✅ Mobile-responsive design

### Backend Features
- ✅ RESTful API architecture
- ✅ IBM watsonx AI integration
- ✅ Secure API key management
- ✅ CORS configuration
- ✅ Rate limiting protection
- ✅ Request validation and sanitization
- ✅ Comprehensive error handling
- ✅ Request logging
- ✅ Health check endpoint

### Security Features
- ✅ Environment-based configuration
- ✅ Helmet.js security headers
- ✅ Rate limiting
- ✅ Input sanitization
- ✅ CORS protection
- ✅ No hardcoded secrets

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/HTTPS
         │
┌────────▼────────┐
│ Express Backend │
│   (Port 5000)   │
└────────┬────────┘
         │ IBM Cloud API
         │
┌────────▼────────┐
│  IBM watsonx    │
│   AI Service    │
└─────────────────┘
```

### Request Flow:
1. User enters message in React frontend
2. Frontend sends POST request to `/api/chat`
3. Backend validates and sanitizes input
4. Backend authenticates with IBM Cloud IAM
5. Backend sends query to watsonx API
6. watsonx processes query and returns AI response
7. Backend formats and returns response to frontend
8. Frontend displays AI response to user

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 8.x or higher (comes with Node.js)
- **IBM Cloud Account**: For watsonx API access ([Sign up](https://cloud.ibm.com/registration))
- **Apache** (optional): For production deployment
- **Git**: For version control

### IBM watsonx Setup

1. Create an IBM Cloud account at https://cloud.ibm.com
2. Create a watsonx.ai project:
   - Navigate to watsonx.ai
   - Create a new project
   - Note your Project ID
3. Create an API key:
   - Go to IBM Cloud Console → Manage → Access (IAM) → API keys
   - Click "Create an IBM Cloud API key"
   - Save the API key securely

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/PetreCostin/AI-Connect.git
cd AI-Connect
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create `.env` file from the example:
```bash
cp .env.example .env
```

3. Edit `.env` and configure your IBM watsonx credentials:

```env
# IBM watsonx Configuration
WATSONX_API_KEY=your_actual_api_key_here
WATSONX_PROJECT_ID=your_actual_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
WATSONX_MODEL_ID=meta-llama/llama-3-70b-instruct

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Available watsonx Models

You can use different models by changing `WATSONX_MODEL_ID`:
- `meta-llama/llama-3-70b-instruct` (Recommended)
- `ibm/granite-13b-chat-v2`
- `mistralai/mixtral-8x7b-instruct-v01`
- `google/flan-t5-xxl`

### Frontend Configuration

The frontend automatically proxies API requests to `http://localhost:5000` during development (configured in `frontend/package.json`).

For production, update the API endpoint in the frontend code or use Apache proxy configuration.

## 🏃 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd backend
npm start
```

The backend will start on http://localhost:5000

For development with auto-reload:
```bash
npm run dev
```

#### Start Frontend (in a new terminal)

```bash
cd frontend
npm start
```

The frontend will start on http://localhost:3000 and automatically open in your browser.

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

This creates an optimized production build in `frontend/build/`.

## 🌐 Apache Deployment

### Prerequisites
- Apache 2.4+
- `mod_rewrite` enabled
- `mod_proxy` enabled
- `mod_proxy_http` enabled
- `mod_headers` enabled

### Enable Required Modules

```bash
sudo a2enmod rewrite
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod headers
sudo systemctl restart apache2
```

### Deployment Steps

1. **Build the frontend**:
```bash
cd frontend
npm run build
```

2. **Deploy to Apache document root**:
```bash
sudo cp -r build/* /var/www/html/
sudo cp ../apache/.htaccess /var/www/html/
```

3. **Configure Apache Virtual Host**:

Create or edit `/etc/apache2/sites-available/ai-connect.conf`:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html
    
    <Directory /var/www/html>
        AllowOverride All
        Require all granted
    </Directory>
    
    # Proxy API requests to Node.js backend
    ProxyPass /api http://localhost:5000/api
    ProxyPassReverse /api http://localhost:5000/api
    
    ErrorLog ${APACHE_LOG_DIR}/ai-connect-error.log
    CustomLog ${APACHE_LOG_DIR}/ai-connect-access.log combined
</VirtualHost>
```

4. **Enable the site**:
```bash
sudo a2ensite ai-connect.conf
sudo systemctl reload apache2
```

5. **Run backend as a service**:

Use PM2 or systemd to run the Node.js backend as a service:

```bash
# Using PM2
npm install -g pm2
cd backend
pm2 start server.js --name ai-connect-backend
pm2 save
pm2 startup
```

### HTTPS Configuration (Recommended)

For production, enable HTTPS using Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-apache
sudo certbot --apache -d your-domain.com
```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-domain.com`

### Endpoints

#### POST /api/chat

Send a message to the AI chatbot.

**Request:**
```json
{
  "message": "What is IBM watsonx?",
  "options": {
    "maxTokens": 500,
    "temperature": 0.7
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "response": "IBM watsonx is an AI and data platform...",
  "timestamp": "2024-01-30T12:00:00.000Z"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2024-01-30T12:00:00.000Z"
}
```

#### GET /api/health

Check API health status.

**Response:**
```json
{
  "success": true,
  "status": "operational",
  "message": "Chat service is ready",
  "timestamp": "2024-01-30T12:00:00.000Z"
}
```

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start

**Problem**: Backend server fails to start or crashes immediately.

**Solutions**:
- Verify Node.js version: `node --version` (should be 16+)
- Check if port 5000 is available: `lsof -i :5000`
- Verify all dependencies are installed: `npm install`
- Check `.env` file exists and has required variables

#### watsonx authentication fails

**Problem**: Getting 401 or 403 errors from watsonx API.

**Solutions**:
- Verify your API key is correct in `.env`
- Check your API key hasn't expired in IBM Cloud Console
- Ensure your watsonx project ID is correct
- Verify you have access to the watsonx.ai service

#### Frontend can't connect to backend

**Problem**: CORS errors or connection refused.

**Solutions**:
- Ensure backend is running: `curl http://localhost:5000/api/health`
- Check CORS configuration in `backend/server.js`
- Verify `ALLOWED_ORIGINS` includes your frontend URL
- Check proxy configuration in `frontend/package.json`

#### Rate limiting triggered

**Problem**: Getting "Too many requests" error.

**Solutions**:
- Increase rate limits in `.env`
- Wait for the rate limit window to reset
- Implement user authentication for higher limits

#### Apache deployment issues

**Problem**: 404 errors or API proxy not working.

**Solutions**:
- Verify `mod_rewrite` is enabled: `apache2ctl -M | grep rewrite`
- Check Apache error logs: `tail -f /var/log/apache2/error.log`
- Ensure `.htaccess` is in the correct location
- Verify `AllowOverride All` is set in Apache config

### Debug Mode

Enable debug logging in backend:

```env
NODE_ENV=development
```

This will show detailed error stacks and request logs.

## 🔒 Security

### Security Best Practices

1. **Never commit sensitive data**:
   - `.env` files are in `.gitignore`
   - API keys should never be in source code

2. **Use environment variables**:
   - All sensitive configuration in `.env`
   - Different `.env` for development/production

3. **Input validation**:
   - All user inputs are validated and sanitized
   - Maximum message length enforced

4. **Rate limiting**:
   - Prevents abuse and DoS attacks
   - Configurable limits per IP

5. **Security headers**:
   - Helmet.js adds security headers
   - XSS protection enabled
   - Clickjacking prevention

6. **HTTPS in production**:
   - Always use HTTPS for production
   - Enable HSTS headers

7. **Regular updates**:
   - Keep dependencies updated: `npm audit`
   - Monitor security advisories

### Security Checklist for Production

- [ ] HTTPS enabled with valid certificate
- [ ] API keys rotated regularly
- [ ] Rate limits configured appropriately
- [ ] CORS origins restricted to trusted domains
- [ ] Input validation on all endpoints
- [ ] Security headers configured
- [ ] Error messages don't leak sensitive info
- [ ] Logging configured (without sensitive data)
- [ ] Regular security audits: `npm audit`

## 🚀 Future Enhancements

### Planned Features

- [ ] **User Authentication**: Add user login and session management
- [ ] **Conversation History**: Persist chat history in database
- [ ] **Multi-language Support**: Internationalization (i18n)
- [ ] **Voice Input**: Speech-to-text integration
- [ ] **File Attachments**: Support document uploads for analysis
- [ ] **Admin Dashboard**: Monitor usage and analytics
- [ ] **Webhooks**: Integration with external systems
- [ ] **Custom Models**: Allow switching between different AI models
- [ ] **Conversation Branching**: Create and manage multiple conversation threads
- [ ] **Export Conversations**: Download chat history
- [ ] **Dark Mode**: UI theme switching
- [ ] **Mobile Apps**: Native iOS/Android applications
- [ ] **Real-time Collaboration**: Multiple users in same conversation
- [ ] **Feedback System**: Rate AI responses for improvement

### Integration Opportunities

- Slack/Teams integration
- CRM systems (Salesforce, HubSpot)
- Ticketing systems (Jira, ServiceNow)
- Knowledge bases (Confluence, Notion)
- Analytics platforms (Google Analytics, Mixpanel)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR
- Keep commits focused and atomic

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For issues, questions, or contributions:

- Create an issue: [GitHub Issues](https://github.com/PetreCostin/AI-Connect/issues)
- Email: support@example.com
- Documentation: [Project Wiki](https://github.com/PetreCostin/AI-Connect/wiki)

## 🙏 Acknowledgments

- IBM watsonx for AI capabilities
- React team for the frontend framework
- Express.js for the backend framework
- All contributors and users of this project

---

**Built with ❤️ for the AI community**