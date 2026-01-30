import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Message from './Message';
import ChatInput from './ChatInput';
import './Chatbot.css';

/**
 * Chatbot Component
 * Main chatbot interface with message history and input
 */
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sample prompts for users
  const samplePrompts = [
    "What is IBM watsonx?",
    "How can AI help with compliance?",
    "Explain machine learning basics",
    "What are the benefits of AI automation?"
  ];

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message on component mount
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm your AI assistant powered by IBM watsonx. I'm here to help you with compliance and support questions. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, []);

  // Send message to backend
  const sendMessage = async (messageText) => {
    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text: messageText,
      sender: 'user',
      timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call backend API
      const response = await axios.post('/api/chat', {
        message: messageText
      });

      if (response.data.success) {
        // Add bot response to chat
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          timestamp: response.data.timestamp
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.data.error || 'Failed to get response');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Failed to connect to the server';
      
      // Add error message as bot response
      const errorBotMessage = {
        id: Date.now() + 1,
        text: `I'm sorry, I encountered an error: ${errorMessage}. Please try again.`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorBotMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChat = () => {
    const welcomeMessage = {
      id: Date.now(),
      text: "Chat cleared. How can I help you?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  };

  // Handle sample prompt click
  const handlePromptClick = (prompt) => {
    if (!isLoading) {
      sendMessage(prompt);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <h1>AI Connect</h1>
          <p>Powered by IBM watsonx</p>
        </div>
        <button 
          className="clear-button" 
          onClick={clearChat}
          disabled={isLoading}
          title="Clear chat"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      {/* Sample prompts - show only when chat is fresh */}
      {messages.length === 1 && !isLoading && (
        <div className="sample-prompts">
          <p className="prompts-title">Try asking:</p>
          <div className="prompts-grid">
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                className="prompt-button"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="typing-indicator">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <ChatInput 
        onSendMessage={sendMessage} 
        disabled={isLoading}
      />
    </div>
  );
};

export default Chatbot;
