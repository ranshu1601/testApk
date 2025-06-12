// server.js - Backend Server
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Azure OpenAI Configuration
const AZURE_CONFIG = {
    endpoint: 'https://your-resource.openai.azure.com/',
    apiKey: 'your-azure-openai-api-key',
    deploymentName: 'gpt-4',
    apiVersion: '2024-02-15-preview'
};

// API Configurations - Configure your GRC and Service API details here
const API_CONFIGS = {
    grc: {
        baseUrl: 'https://your-grc-api.com/api',
        headers: {
            'Authorization': 'Bearer your-grc-api-token',
            'Content-Type': 'application/json',
            'X-API-Key': 'your-grc-api-key' // Additional auth if needed
        }
    },
    service: {
        baseUrl: 'https://your-service-api.com/api',
        headers: {
            'Authorization': 'Bearer your-service-api-token',
            'Content-Type': 'application/json',
            'X-API-Key': 'your-service-api-key' // Additional auth if needed
        }
    }
};

// Intent classification based on keywords and patterns
function classifyIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    const grcKeywords = [
        'compliance', 'risk', 'governance', 'policy', 'audit', 'regulation',
        'control', 'framework', 'assessment', 'security', 'privacy', 'gdpr',
        'sox', 'iso', 'nist', 'regulatory', 'violation', 'incident',
        'threat', 'vulnerability', 'breach', 'data protection', 'access control'
    ];
    
    const serviceKeywords = [
        'service', 'api', 'status', 'health', 'uptime', 'performance',
        'monitor', 'alert', 'metric', 'log', 'trace', 'endpoint',
        'availability', 'latency', 'error', 'deployment', 'infrastructure',
        'server', 'database', 'network', 'application'
    ];
    
    const intents = [];
    
    if (grcKeywords.some(keyword => lowerMessage.includes(keyword))) {
        intents.push('grc');
    }
    
    if (serviceKeywords.some(keyword => lowerMessage.includes(keyword))) {
        intents.push('service');
    }
    
    // If no specific intents detected, classify as general
    if (intents.length === 0) {
        intents.push('general');
    }
    
    return intents;
}

// GRC API Functions
async function callGrcApi(endpoint, params = {}) {
    try {
        console.log(`Calling GRC API: ${endpoint}`);
        
        const response = await axios.get(`${API_CONFIGS.grc.baseUrl}/${endpoint}`, {
            headers: API_CONFIGS.grc.headers,
            params: params,
            timeout: 10000 // 10 second timeout
        });
        
        return {
            service: 'GRC',
            endpoint: endpoint,
            status: 'Success',
            data: response.data,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`GRC API Error (${endpoint}):`, error.message);
        
        return {
            service: 'GRC',
            endpoint: endpoint,
            status: 'Error',
            data: `Failed to fetch GRC data: ${error.message}`,
            timestamp: new Date().toISOString()
        };
    }
}

// Service API Functions  
async function callServiceApi(endpoint, params = {}) {
    try {
        console.log(`Calling Service API: ${endpoint}`);
        
        const response = await axios.get(`${API_CONFIGS.service.baseUrl}/${endpoint}`, {
            headers: API_CONFIGS.service.headers,
            params: params,
            timeout: 10000 // 10 second timeout
        });
        
        return {
            service: 'Service',
            endpoint: endpoint,
            status: 'Success',
            data: response.data,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error(`Service API Error (${endpoint}):`, error.message);
        
        return {
            service: 'Service',
            endpoint: endpoint,
            status: 'Error',
            data: `Failed to fetch service data: ${error.message}`,
            timestamp: new Date().toISOString()
        };
    }
}

// Route API calls based on intent and message content
async function routeApiCalls(intents, message) {
    const apiCalls = [];
    const lowerMessage = message.toLowerCase();
    
    for (const intent of intents) {
        switch (intent) {
            case 'grc':
                // Determine specific GRC endpoint based on message content
                if (lowerMessage.includes('policy') || lowerMessage.includes('policies')) {
                    apiCalls.push(await callGrcApi('policies'));
                } else if (lowerMessage.includes('risk') || lowerMessage.includes('risks')) {
                    apiCalls.push(await callGrcApi('risks'));
                } else if (lowerMessage.includes('audit') || lowerMessage.includes('audits')) {
                    apiCalls.push(await callGrcApi('audits'));
                } else if (lowerMessage.includes('compliance')) {
                    apiCalls.push(await callGrcApi('compliance-status'));
                } else if (lowerMessage.includes('incident') || lowerMessage.includes('breach')) {
                    apiCalls.push(await callGrcApi('incidents'));
                } else if (lowerMessage.includes('control') || lowerMessage.includes('controls')) {
                    apiCalls.push(await callGrcApi('controls'));
                } else if (lowerMessage.includes('assessment')) {
                    apiCalls.push(await callGrcApi('assessments'));
                } else {
                    // Default GRC call for general governance queries
                    apiCalls.push(await callGrcApi('overview'));
                }
                break;
                
            case 'service':
                // Determine specific Service endpoint based on message content
                if (lowerMessage.includes('status') || lowerMessage.includes('health')) {
                    apiCalls.push(await callServiceApi('health-check'));
                } else if (lowerMessage.includes('performance') || lowerMessage.includes('metrics')) {
                    apiCalls.push(await callServiceApi('metrics'));
                } else if (lowerMessage.includes('alert') || lowerMessage.includes('alerts')) {
                    apiCalls.push(await callServiceApi('alerts'));
                } else if (lowerMessage.includes('log') || lowerMessage.includes('logs')) {
                    apiCalls.push(await callServiceApi('logs'));
                } else if (lowerMessage.includes('uptime') || lowerMessage.includes('availability')) {
                    apiCalls.push(await callServiceApi('uptime'));
                } else if (lowerMessage.includes('deployment') || lowerMessage.includes('deploy')) {
                    apiCalls.push(await callServiceApi('deployments'));
                } else if (lowerMessage.includes('error') || lowerMessage.includes('errors')) {
                    apiCalls.push(await callServiceApi('errors'));
                } else {
                    // Default service call for general service queries
                    apiCalls.push(await callServiceApi('status'));
                }
                break;
        }
    }
    
    return apiCalls;
}

// Azure OpenAI API call
async function callAzureAI(messages, apiResults = []) {
    const systemMessage = {
        role: "system",
        content: `You are an intelligent assistant specializing in GRC (Governance, Risk, Compliance) and Service Management. 
        
        You have access to real-time data from various APIs. When API results are available, analyze and incorporate them naturally into your response.
        
        ${apiResults.length > 0 ? `
        Current API Results:
        ${JSON.stringify(apiResults, null, 2)}
        
        Please analyze this data and provide insights based on the user's question.
        ` : ''}
        
        Guidelines:
        - Provide helpful, accurate, and contextual responses
        - Be conversational but professional
        - If API calls failed, acknowledge the limitation and provide general guidance
        - For GRC queries, focus on compliance, risk management, and governance
        - For Service queries, focus on operational status, performance, and monitoring
        - Always explain what the data means in business context
        - Suggest actionable next steps when appropriate
        `
    };

    try {
        const response = await axios.post(
            `${AZURE_CONFIG.endpoint}/openai/deployments/${AZURE_CONFIG.deploymentName}/chat/completions?api-version=${AZURE_CONFIG.apiVersion}`,
            {
                messages: [systemMessage, ...messages],
                max_tokens: 1000,
                temperature: 0.7,
                top_p: 0.9,
                frequency_penalty: 0.3,
                presence_penalty: 0.3
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': AZURE_CONFIG.apiKey
                },
                timeout: 30000 // 30 second timeout
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Azure AI Error:', error.response?.data || error.message);
        
        // Fallback response when Azure AI is unavailable
        if (apiResults.length > 0) {
            return `I was able to retrieve information from the APIs, but I'm having trouble processing it with AI right now. Here's the raw data I found:\n\n${JSON.stringify(apiResults, null, 2)}`;
        } else {
            return "I apologize, but I'm having trouble connecting to the AI service right now. Please try again later or contact your system administrator.";
        }
    }
}

// Main chat endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;
        
        console.log(`Received message: ${message}`);
        
        // Validate input
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                error: 'Invalid message',
                message: 'Message is required and must be a string'
            });
        }
        
        // Classify the intent of the message
        const intents = classifyIntent(message);
        console.log('Detected intents:', intents);
        
        // Route and execute API calls based on intents
        const apiCalls = await routeApiCalls(intents, message);
        console.log(`API calls completed: ${apiCalls.length}`);
        
        // Prepare messages for Azure AI
        const messages = [
            ...conversationHistory,
            { role: "user", content: message }
        ];
        
        // Get AI response with API results
        const aiResponse = await callAzureAI(messages, apiCalls);
        
        // Send response back to frontend
        res.json({
            response: aiResponse,
            apiCalls: apiCalls,
            intents: intents,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        services: {
            azure_ai: AZURE_CONFIG.apiKey ? 'Configured' : 'Not Configured',
            grc_api: API_CONFIGS.grc.baseUrl ? 'Configured' : 'Not Configured',
            service_api: API_CONFIGS.service.baseUrl ? 'Configured' : 'Not Configured'
        },
        version: '1.0.0'
    });
});

// Configuration endpoint to update API settings (optional)
app.post('/config', (req, res) => {
    try {
        const { service, config } = req.body;
        
        if (service === 'azure' && config) {
            Object.assign(AZURE_CONFIG, config);
        } else if (service === 'grc' && config) {
            Object.assign(API_CONFIGS.grc, config);
        } else if (service === 'service' && config) {
            Object.assign(API_CONFIGS.service, config);
        } else {
            return res.status(400).json({ error: 'Invalid service or config' });
        }
        
        res.json({ message: 'Configuration updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update configuration' });
    }
});

// Error handling middleware
app.use((error, req, res, next) => {
    console.error('Unhandled error:', error);
    res.status(500).json({
        error: 'Internal server error',
        message: 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: 'The requested endpoint does not exist'
    });
});

// Start server
app.listen(port, () => {
    console.log(`🚀 Agentic AI Backend running on http://localhost:${port}`);
    console.log('📋 Available endpoints:');
    console.log('   POST /chat - Main chat endpoint');
    console.log('   GET /health - Health check');
    console.log('   POST /config - Update configuration');
    console.log('');
    console.log('⚙️  Configuration status:');
    console.log(`   Azure AI: ${AZURE_CONFIG.apiKey ? '✅ Configured' : '❌ Not Configured'}`);
    console.log(`   GRC API: ${API_CONFIGS.grc.baseUrl !== 'https://your-grc-api.com/api' ? '✅ Configured' : '❌ Not Configured'}`);
    console.log(`   Service API: ${API_CONFIGS.service.baseUrl !== 'https://your-service-api.com/api' ? '✅ Configured' : '❌ Not Configured'}`);
    console.log('');
    console.log('📝 Make sure to configure your API keys and endpoints in the configuration objects above');
});