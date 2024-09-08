import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './Chat.css';  // Make sure we use a separate CSS for styling

function Chat({ onClose }) {
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const walletAddress = '0x1234****5678'; // Placeholder, replace with actual wallet data
  const etherscanLink = `https://etherscan.io/address/${walletAddress}`;

  // Function to handle accepting or declining the disclaimer
  const handleDisclaimer = (accepted) => {
    setShowDisclaimer(false);
    if (accepted) {
      setAcceptedDisclaimer(true);
    } else {
      onClose(); // If declined, close the chat
    }
  };

  // Handle sending a message
  const sendMessage = () => {
    if (timeLeft === 0 && message.length <= 10) {
      const newMessage = {
        text: message,
        timestamp: new Date().toLocaleTimeString(),
        user: walletAddress,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
      setTimeLeft(600); // 10 minutes countdown
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  return (
    <Draggable>
      <div className="chat-window">
        <div className="chat-title-bar">
          <span>💬 Chat</span>
          <button className="chat-close-btn" onClick={onClose}>X</button>
        </div>
        {showDisclaimer && (
          <div className="chat-disclaimer">
            <p>This is a public chat and is not moderated. Do not visit any links posted by users. We are not responsible for any losses.</p>
            <button onClick={() => handleDisclaimer(true)}>Accept</button>
            <button onClick={() => handleDisclaimer(false)}>Decline</button>
          </div>
        )}
        {acceptedDisclaimer && (
          <div className="chat-content">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className="chat-message">
                  <a href={etherscanLink} target="_blank" rel="noopener noreferrer">
                    {msg.user}
                  </a>
                  <span>{msg.timestamp}</span>: {msg.text}
                </div>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                placeholder={timeLeft > 0 ? `Wait ${timeLeft} seconds...` : 'Type your message...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={timeLeft > 0}
              />
              <button onClick={sendMessage} disabled={timeLeft > 0 || message.length > 10}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
}

export default Chat;
