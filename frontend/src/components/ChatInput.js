import React, { useState } from 'react';
import './ChatInput.css';

/**
 * ChatInput Component
 * Input field and send button for user messages
 * @param {object} props - Component props
 * @param {function} props.onSendMessage - Callback when message is sent
 * @param {boolean} props.disabled - Whether input is disabled
 */
const ChatInput = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const message = inputValue.trim();
    if (message && !disabled) {
      onSendMessage(message);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    // Send on Enter, but allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <textarea
        className="chat-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type your message here..."
        disabled={disabled}
        rows={1}
        maxLength={2000}
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={disabled || !inputValue.trim()}
      >
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );
};

export default ChatInput;
