import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Message from "./Message";
import ChatInput from "./ChatInput";
import "./Chatbot.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const samplePrompts = [
    "What is IBM watsonx?",
    "How can AI help with compliance?",
    "Explain machine learning basics",
    "Benefits of AI automation?",
  ];

  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        text: "👋 Hi! I’m your AI assistant powered by IBM watsonx. How can I help you today?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text) => {
    const userMsg = {
      id: Date.now(),
      text,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await axios.post("/api/chat", { message: text });

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: res.data.response,
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "⚠️ Something went wrong. Please try again.",
          sender: "bot",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: Date.now(),
        text: "Chat cleared ✨ How can I help now?",
        sender: "bot",
        timestamp: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <h1>AI Connect</h1>
          <p>Powered by IBM watsonx</p>
        </div>

        {/* AI identity indicator (dynamic) */}
        <div className="ai-identity" aria-live="polite">
          <span className={`ai-dot ${isLoading ? "processing" : "online"}`} />
          <div className="ai-meta">
            <span className="ai-name">watsonx</span>
            <span className="ai-status">
              {isLoading ? "Assistant • thinking…" : "Assistant • online"}
            </span>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="clear-button"
            onClick={clearChat}
            title="Clear chat"
          >
            🗑️
          </button>
          <span className="secure-badge" title="Encrypted conversation">
            🔒 Secure
          </span>
        </div>
      </div>

      {messages.length === 1 && (
        <div className="sample-prompts" aria-hidden={false}>
          <p className="prompts-title">Quick prompts</p>
          <div className="prompts-grid">
            {samplePrompts.map((p, i) => (
              <button
                key={i}
                className={`prompt-button prompt-chip`}
                onClick={() => sendMessage(p)}
                aria-label={`Send prompt: ${p}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="messages-container">
        {messages.map((msg) => (
          <Message key={msg.id} message={msg} />
        ))}

        {isLoading && (
          <div className="typing-indicator">
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
            <span className="typing-dot"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-wrapper">
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default Chatbot;
