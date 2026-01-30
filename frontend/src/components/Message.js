import React from 'react';
import './Message.css';

/**
 * Message Component
 * Displays a single message in the chat
 * @param {object} props - Component props
 * @param {object} props.message - Message object with text, sender, timestamp
 */
const Message = ({ message }) => {
  const { text, sender, timestamp } = message;
  const isBot = sender === 'bot';

  // Format timestamp
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message ${isBot ? 'bot-message' : 'user-message'}`}>
      <div className="message-content">
        <div className="message-sender">
          {isBot ? '🤖 AI Assistant' : '👤 You'}
        </div>
        <div className="message-text">{text}</div>
        <div className="message-timestamp">
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default Message;
