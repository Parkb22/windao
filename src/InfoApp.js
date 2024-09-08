import React, { useState } from 'react';
import { useAccount } from 'wagmi'; // To get connected wallet info
import Draggable from 'react-draggable';
import './InfoApp.css';

function InfoApp({ onClose }) {
  const { address } = useAccount(); // Get wallet address if connected
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [tutorialVisible, setTutorialVisible] = useState(true);

  const formatAddress = (address) => {
    return address ? `${address.slice(0, 4)}****${address.slice(-4)}` : 'null';
  };

  const getPromptLine = () => {
    return `C:\\Users\\${formatAddress(address)}>`;
  };

  const handleCommand = (command) => {
    let output = '';
    switch (command.toLowerCase()) {
      case 'about':
        output = 'Coming Soon';
        break;
      case 'ca':
        output = 'CA: Coming Soon';
        break;
      case 'tokenomics':
        output = '1,000,000,000 WINDAO\n10% Community Airdrop\n10% Seed & Private Investors\n30% Marketing\n5% Dev Treasury\n35% Ecosystem Rewards\n10% DAO Treasury\nFor full information visit the WinDAOs docs';
        break;
      case 'roadmap':
        output = 'Roadmap : Coming Soon';
        break;
      case 'reset':
        setHistory([]);
        return;
      default:
        output = `Unknown command: ${command}`;
    }

    typeOutResponse(output);
  };

  const typeOutResponse = (response) => {
    setIsTyping(true);
    let index = 0;
    let currentResponse = '';
    const interval = setInterval(() => {
      if (index < response.length) {
        currentResponse += response[index];
        setHistory((prev) => [...prev.slice(0, -1), currentResponse]); // Update last entry
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30); // Adjust this for typing speed
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== '') {
      const newHistory = [...history, `${getPromptLine()} ${input}`];
      setHistory(newHistory);
      handleCommand(input.trim());
    }
    setInput('');
  };

  const renderTutorial = () => (
    <div className="tutorial">
      <p style={{ color: 'teal' }}>
        Type <span className="command">about</span> to learn about WinDAOs<br />
        Type <span className="command">ca</span> to view contract address<br />
        Type <span className="command">tokenomics</span> to view WinDAOs Tokenomics<br />
        Type <span className="command">roadmap</span> to view the WinDAOs roadmap<br />
        Type <span className="command">reset</span> to clear the screen
      </p>
    </div>
  );

  return (
    <Draggable handle=".info-title-bar">
      <div className="info-app">
        <div className="info-title-bar">
          <span>Command Prompt</span>
          <button className="info-close-btn" onClick={onClose}>X</button>
        </div>
        <div className="info-content">
          {tutorialVisible && renderTutorial()}

          <div className="output-area">
            {history.map((item, index) => (
              <div
                key={index}
                style={{
                  color: item.startsWith('C:') ? '#00ff00' : '#00aced',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {item}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="command-line">
            <span className="prompt-line">{getPromptLine()}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="command-input"
              autoFocus
            />
          </form>
        </div>
      </div>
    </Draggable>
  );
}

export default InfoApp;
