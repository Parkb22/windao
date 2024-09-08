import React from 'react';
import './Popup.css';

function Popup({ title, message, ethBalance, onClose }) {
  return (
    <div className="popup">
      <div className="popup-title-bar">
        <span>{title}</span>
        <button className="popup-close-btn" onClick={onClose}>X</button>
      </div>
      <div className="popup-content">
        <div className="popup-body">{message}</div>
        <div className="popup-body">Your ETH: {ethBalance}</div> {/* Display ETH balance */}
        <div className="popup-actions">
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default Popup;
