// config.js - Configuration Template
// Copy this file and rename to config.local.js, then fill in your actual API details

const config = {
    // Azure OpenAI Configuration
    azure: {
        endpoint: process.env.AZURE_OPENAI_ENDPOINT || 'https://sapgenaiassistant.openai.azure.com/openai/deployments/gpt-35-turbo-16k/chat/completions?api-version=2025-01-01-preview',
        apiKey: process.env.AZURE_OPENAI_API_KEY || '20eb40b941a243a3b545c6145e8411b1',
        deploymentName: process.env.AZURE_DEPLOYMENT_NAME || 'gpt-35-turbo',
        apiVersion: '2025-01-01-preview'
    },

    // GRC API Configuration
    grc: {
        baseUrl: process.env.GRC_API_BASE_URL || 'http://asapjfd.go.johnsoncontrols.com:8010/sap/opu/odata/sap/ZGRC_ODATA_SRV/ZGRCSet',
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
        baseUrl: process.env.SERVICE_API_BASE_URL || 'https://jci.service-now.com/api/jni/access_to_incident_and_service_request/getIncidentsByQuery?query=active=true^assignment_group=63d0a00ddbe44300f2fcdbbb5e96192c^u_affected_user!=b7ebc7c5db041f40e8b6d5ab5e961913',
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
