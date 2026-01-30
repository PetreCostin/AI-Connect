# AI Connect - Quick Start Guide

## 🚀 5-Minute Setup

### Prerequisites Checklist
- [ ] Node.js 16+ installed
- [ ] npm installed
- [ ] IBM Cloud account created
- [ ] watsonx API key obtained

### Step 1: Get IBM watsonx Credentials (First Time Only)

1. Visit [IBM Cloud](https://cloud.ibm.com)
2. Navigate to watsonx.ai
3. Create a project and note the **Project ID**
4. Go to Manage → Access (IAM) → API keys
5. Create an API key and save it securely

### Step 2: Clone and Install

```bash
# Clone the repository
git clone https://github.com/PetreCostin/AI-Connect.git
cd AI-Connect

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Backend

```bash
# In the backend directory
cd backend
cp .env.example .env

# Edit .env file with your credentials
nano .env  # or use your preferred editor
```

Update these values in `.env`:
```env
WATSONX_API_KEY=your_actual_api_key_here
WATSONX_PROJECT_ID=your_actual_project_id_here
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

You should see:
```
==================================================
AI Connect Backend Server
Environment: development
Server running on port 5000
Access at: http://localhost:5000
==================================================
✓ watsonx service is configured
==================================================
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

Your browser will automatically open to `http://localhost:3000`

### Step 5: Test the Chatbot

1. You'll see a welcome message from the AI assistant
2. Try one of the sample prompts or type your own question
3. Watch the typing indicator while AI generates response
4. Enjoy chatting with IBM watsonx! 🤖

## 🎯 Quick Commands

### Development
```bash
# Start backend with auto-reload
cd backend && npm run dev

# Start frontend
cd frontend && npm start

# Check backend health
curl http://localhost:5000/api/health
```

### Testing
```bash
# Test API endpoint
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello, watsonx!"}'
```

## 🐛 Common Issues

### Backend won't start
- Check if port 5000 is in use
- Ensure all dependencies are installed

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `proxy` in `frontend/package.json` points to `http://localhost:5000`

### watsonx authentication fails
- Verify your API key is correct
- Check your Project ID
- Ensure you have access to watsonx.ai in your IBM Cloud account

## 📱 Using the Application

### Chat Interface
- **Send Message**: Type and press Enter (or click send button)
- **New Line**: Press Shift+Enter
- **Clear Chat**: Click trash icon in header
- **Sample Prompts**: Click any suggestion button

### Features to Try
- Ask about IBM watsonx capabilities
- Request help with compliance questions
- Get explanations of technical concepts
- Test with different types of queries

## 🔒 Security Note

⚠️ **Never commit your `.env` file!**

The `.gitignore` file ensures `.env` is not tracked by git, but always double-check before committing.

## 📚 Next Steps

- Read the full [README.md](README.md) for comprehensive documentation
- Review [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
- Check Apache deployment guide for production setup
- Explore watsonx model options for different use cases

## 🆘 Need Help?

- Check the [Troubleshooting](README.md#troubleshooting) section in README
- Review [IBM watsonx documentation](https://www.ibm.com/docs/en/watsonx-as-a-service)
- Open an issue on GitHub

---

**Ready in 5 minutes! Happy chatting! 🎉**
