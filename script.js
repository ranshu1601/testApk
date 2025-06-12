class AgenticChatbot {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendButton');
        this.typingIndicator = document.getElementById('typingIndicator');
        
        this.conversationHistory = [];
        this.backendUrl = 'http://localhost:3000'; // Backend server URL
        
        this.initializeEventListeners();
        this.autoResizeTextarea();
        this.checkBackendStatus();
    }

    initializeEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        this.chatInput.addEventListener('input', () => this.autoResizeTextarea());
    }

    autoResizeTextarea() {
        this.chatInput.style.height = 'auto';
        this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
    }

    async checkBackendStatus() {
        try {
            const response = await fetch(`${this.backendUrl}/health`);
            if (response.ok) {
                this.updateStatus('AI Ready', true);
            } else {
                this.updateStatus('Backend Error', false);
            }
        } catch (error) {
            this.updateStatus('Backend Offline', false);
            this.addMessage('system', '⚠️ Backend server is not running. Please start the backend server to use the chatbot.');
        }
    }

    updateStatus(text, isOnline) {
        const statusIndicator = document.querySelector('.status-indicator span');
        const statusDot = document.querySelector('.status-dot');
        
        statusIndicator.textContent = text;
        statusDot.style.background = isOnline ? '#4CAF50' : '#f44336';
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        this.chatInput.value = '';
        this.autoResizeTextarea();
        this.showTyping();

        try {
            const response = await fetch(`${this.backendUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    conversationHistory: this.conversationHistory.slice(-10) // Send last 10 messages for context
                })
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();
            this.hideTyping();

            // Display API calls that were made
            if (data.apiCalls && data.apiCalls.length > 0) {
                data.apiCalls.forEach(apiCall => {
                    this.addApiCallIndicator(apiCall);
                });
            }

            // Display the AI response
            this.addMessage('bot', data.response);

            // Update conversation history
            this.conversationHistory.push(
                { role: "user", content: message },
                { role: "assistant", content: data.response }
            );

        } catch (error) {
            this.hideTyping();
            this.addErrorMessage(`Error: ${error.message}`);
        }
    }

    addMessage(type, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        if (type === 'user') {
            messageDiv.textContent = content;
        } else {
            messageDiv.innerHTML = this.formatMessage(content);
        }
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    addApiCallIndicator(apiCall) {
        const apiDiv = document.createElement('div');
        apiDiv.className = 'api-call-indicator';
        apiDiv.innerHTML = `
            <div class="api-call-header">
                🔌 API Call: ${apiCall.service} - ${apiCall.endpoint}
            </div>
            <div>Status: <strong>${apiCall.status}</strong></div>
            ${apiCall.data ? `<div class="api-response">${this.formatApiResponse(apiCall.data)}</div>` : ''}
        `;
        this.chatMessages.appendChild(apiDiv);
        this.scrollToBottom();
    }

    addErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <span>⚠️</span>
            <span>${message}</span>
        `;
        this.chatMessages.appendChild(errorDiv);
        this.scrollToBottom();
    }

    formatMessage(content) {
        return content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
    }

    formatApiResponse(data) {
        if (typeof data === 'object') {
            return `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
        return data.toString().substring(0, 200) + (data.length > 200 ? '...' : '');
    }

    showTyping() {
        this.typingIndicator.style.display = 'flex';
        this.sendButton.disabled = true;
        this.scrollToBottom();
    }

    hideTyping() {
        this.typingIndicator.style.display = 'none';
        this.sendButton.disabled = false;
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }
}

// Initialize the chatbot when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AgenticChatbot();
});