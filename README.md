# Agentic AI Chatbot

A sophisticated chatbot application that intelligently routes user queries to appropriate APIs (GRC and Service) and provides comprehensive responses using Azure AI.

## 🚀 Features

- **Intelligent Intent Classification** - Automatically determines which APIs to call based on user questions
- **GRC Integration** - Governance, Risk, and Compliance API integration
- **Service API Integration** - Service monitoring and management API integration
- **Azure AI Powered** - Uses Azure OpenAI for intelligent response generation
- **Real-time Chat Interface** - Modern, responsive web interface
- **API Call Visualization** - Shows which APIs were called and their responses
- **Conversation Memory** - Maintains context across chat sessions

## 📁 Project Structure

```
agentic-ai-chatbot/
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Stylesheet
│   └── script.js           # Frontend JavaScript
├── backend/
│   ├── server.js           # Main backend server
│   ├── config.js           # Configuration template
│   ├── package.json        # Node.js dependencies
│   └── .env.template       # Environment variables template
└── README.md              # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Azure OpenAI API access
- GRC API access
- Service API access

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.template .env
   # Edit .env with your actual API credentials
   ```

3. **Update Configuration**
   - Edit `server.js` and update the `AZURE_CONFIG` and `API_CONFIGS` objects
   - Add your actual API endpoints and authentication details

4. **Start the Backend Server**
   ```bash
   npm start
   # or for development with auto-reload
   npm run dev
   ```

### Frontend Setup

1. **Serve the Frontend**
   - Use any static file server (like Live Server in VS Code)
   - Or use Python: `python -m http.server 8080`
   - Or use Node.js: `npx serve .`

2. **Access the Application**
   - Open `http://localhost:8080` in your browser
   - Ensure backend is running on `http://localhost:3000`

## 🔧 Configuration

### Azure OpenAI Configuration

```javascript
const AZURE_CONFIG = {
    endpoint: 'https://your-resource.openai.azure.com/',
    apiKey: 'your-azure-openai-api-key',
    deploymentName: 'gpt-4',
    apiVersion: '2024-02-15-preview'
};
```

### GRC API Configuration

```javascript
const API_CONFIGS = {
    grc: {
        baseUrl: 'https://your-grc-api.com/api',
        headers: {
            'Authorization': 'Bearer your-grc-api-token',
            'Content-Type': 'application/json'
        }
    }
};
```

### Service API Configuration

```javascript
const API_CONFIGS = {
    service: {
        baseUrl: 'https://your-service-api.com/api',
        headers: {
            'Authorization': 'Bearer your-service-api-token',
            'Content-Type': 'application/json'
        }
    }
};
```

## 📊 Intent Classification

The system automatically classifies user intents based on keywords:

### GRC Keywords
- compliance, risk, governance, policy, audit, regulation
- control, framework, assessment, security, privacy, gdpr
- sox, iso, nist, regulatory, violation, incident

### Service Keywords
- service, api, status, health, uptime, performance
- monitor, alert, metric, log, trace, endpoint
- availability, latency, error, deployment

## 🔗 API Endpoints

### GRC API Endpoints
- `/policies` - Policy information
- `/risks` - Risk assessments
- `/audits` - Audit results
- `/compliance-status` - Compliance status
- `/incidents` - Security incidents
- `/controls` - Control frameworks
- `/assessments` - Assessment reports

### Service API Endpoints
- `/health-check` - Service health status
- `/metrics` - Performance metrics
- `/alerts` - System alerts
- `/logs` - Application logs
- `/uptime` - Uptime statistics
- `/deployments` - Deployment status
- `/errors` - Error reports

## 💬 Example Interactions

**GRC Queries:**
- "What's our current compliance status?"
- "Show me recent security incidents"
- "What policies need review?"

**Service Queries:**
- "What's the service health status?"
- "Show me performance metrics"
- "Are there any alerts?"

**General Queries:**
- "Explain risk management best practices"
- "How can we improve our security posture?"

## 🚀 Deployment

### Development
```bash
# Backend
cd backend
npm run dev

# Frontend (separate terminal)
cd frontend
npx serve .
```

### Production
```bash
# Backend
cd backend
npm start

# Frontend - Deploy to web server
# Upload frontend files to your web hosting service
```

## 🔒 Security Considerations

- Store API keys in environment variables
- Use HTTPS in production
- Implement rate limiting
- Add input validation and sanitization
- Use proper CORS configuration

## 🐛 Troubleshooting

### Common Issues

1. **Backend Offline Error**
   - Ensure backend server is running on port 3000
   - Check console for error messages

2. **API Configuration Issues**
   - Verify API endpoints and authentication
   - Check network connectivity
   - Review API documentation

3. **Azure AI Errors**
   - Verify Azure OpenAI credentials
   - Check deployment name and endpoint
   - Ensure sufficient quota

## 📝 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support and questions:
- Check the troubleshooting section
- Review API documentation
- Contact your system administrator