// config.js - Configuration Template
// Copy this file and rename to config.local.js, then fill in your actual API details

const config = {
    // Azure OpenAI Configuration
    azure: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT || 'https://your-resource.openai.azure.com/',
        apiKey: process.env.AZURE_OPENAI_API_KEY || 'your-azure-openai-api-key',
        deploymentName: process.env.AZURE_DEPLOYMENT_NAME || 'gpt-4',
        apiVersion: '2024-02-15-preview'
    },

    // GRC API Configuration
    grc: {
        baseUrl: process.env.GRC_API_BASE_URL || 'https://your-grc-api.com/api',
        headers: {
            'Authorization': `Bearer ${process.env.GRC_API_TOKEN || 'your-grc-api-token'}`,
            'Content-Type': 'application/json',
            'X-API-Key': process.env.GRC_API_KEY || 'your-grc-api-key'
        },
        endpoints: {
            policies: 'policies',
            risks: 'risks',
            audits: 'audits',
            compliance: 'compliance-status',
            incidents: 'incidents',
            controls: 'controls',
            assessments: 'assessments',
            overview: 'overview'
        }
    },

    // Service API Configuration
    service: {
        baseUrl: process.env.SERVICE_API_BASE_URL || 'https://your-service-api.com/api',
        headers: {
            'Authorization': `Bearer ${process.env.SERVICE_API_TOKEN || 'your-service-api-token'}`,
            'Content-Type': 'application/json',
            'X-API-Key': process.env.SERVICE_API_KEY || 'your-service-api-key'
        },
        endpoints: {
            health: 'health-check',
            metrics: 'metrics',
            alerts: 'alerts',
            logs: 'logs',
            uptime: 'uptime',
            deployments: 'deployments',
            errors: 'errors',
            status: 'status'
        }
    },

    // Server Configuration
    server: {
        port: process.env.PORT || 3000,
        corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:8080'
    }
};

module.exports = config;