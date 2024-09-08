import React, { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Draggable from 'react-draggable';
import InfoApp from './InfoApp';
import ControlPanel from './ControlPanel';
import Airdrop from './Airdrop';
import { useAccount } from 'wagmi';
import { db, doc, getDoc, setDoc } from './firebase';
import './App.css';

function App() {
  const { address, isConnected } = useAccount();
  const [showMenu, setShowMenu] = useState(false);
  const [time, setTime] = useState(new Date());
  const [showInfoApp, setShowInfoApp] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);
  const [showAirdrop, setShowAirdrop] = useState(false);
  const [showPopup, setShowPopup] = useState(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showPostIt, setShowPostIt] = useState(true);
  const [input, setInput] = useState('');
  const [postItText, setPostItText] = useState('');
  const [referrer, setReferrer] = useState(null);
  const [icons] = useState([
    'Info', 'Airdrop', 'Telegram', 'Twitter', 'Staking', 'DAO', 'Docs', 'Calculator', 'ControlPanel'
  ]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const openInfoApp = () => {
    setShowInfoApp(true);
  };

  const closeInfoApp = () => {
    setShowInfoApp(false);
  };

  const openControlPanel = () => {
    setShowControlPanel(true);
  };

  const closeControlPanel = () => {
    setShowControlPanel(false);
  };

  const openAirdrop = () => {
    setShowAirdrop(true);
  };

  const closeAirdrop = () => {
    setShowAirdrop(false);
  };

  const openPopup = (type) => {
    setShowPopup(type);
  };

  const closePopup = () => {
    setShowPopup(null);
  };

  const openCalculator = () => {
    setShowCalculator(true);
  };

  const closeCalculator = () => {
    setShowCalculator(false);
  };

  const handleCalculatorInput = (value) => {
    if (value === '=') {
      try {
        setInput(eval(input).toString());
      } catch {
        setInput('Error');
      }
    } else if (value === 'C') {
      setInput('');
    } else {
      setInput(input + value);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const closePostIt = () => {
    setShowPostIt(false);
  };

  // Capture referral code from the URL on page load
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const ref = queryParams.get('ref');
    if (ref) {
      setReferrer(ref);
    }
  }, []);

  // Check if the user has been referred and store the referrer in Firebase
  useEffect(() => {
    if (isConnected && address && referrer) {
      const handleReferral = async () => {
        try {
          const userDoc = doc(db, 'users', address);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            const userData = userSnap.data();

            // If the user has not been referred yet
            if (!userData.referredBy) {
              const referrerDoc = doc(db, 'users', referrer);
              const referrerSnap = await getDoc(referrerDoc);

              if (referrerSnap.exists()) {
                const referrerData = referrerSnap.data();

                // Update the referrer document to add this user as a referral
                await setDoc(referrerDoc, {
                  ...referrerData,
                  referrals: (referrerData.referrals || 0) + 1,
                  referredUsers: [...(referrerData.referredUsers || []), address]
                });

                // Update the current user's document with referrer info
                await setDoc(userDoc, { ...userData, referredBy: referrer });

                console.log('Referral tracked successfully.');
              }
            }
          }
        } catch (error) {
          console.error('Error processing referral:', error);
        }
      };

      handleReferral();
    }
  }, [isConnected, address, referrer]);

  return (
    <div className="desktop">
      {/* Draggable Desktop Icons with Emojis */}
      {icons.includes('Info') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={openInfoApp}>
            <span role="img" aria-label="Info">💻</span>
            <span>Info</span>
          </div>
        </Draggable>
      )}
      {icons.includes('Airdrop') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={openAirdrop}>
            <span role="img" aria-label="Airdrop">🪂</span>
            <span>Airdrop</span>
          </div>
        </Draggable>
      )}
      {icons.includes('Telegram') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={() => window.open('https://t.me', '_blank')}>
            <span role="img" aria-label="Telegram">✈️</span>
            <span>Telegram</span>
          </div>
        </Draggable>
      )}
      {icons.includes('Twitter') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={() => window.open('https://twitter.com', '_blank')}>
            <span role="img" aria-label="Twitter">🐦</span>
            <span>Twitter</span>
          </div>
        </Draggable>
      )}
      {icons.includes('Staking') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={() => openPopup('Staking')}>
            <span role="img" aria-label="Staking">🏦</span>
            <span>Staking</span>
          </div>
        </Draggable>
      )}
      {icons.includes('DAO') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={() => openPopup('DAO')}>
            <span role="img" aria-label="DAO">🏛️</span>
            <span>DAO</span>
          </div>
        </Draggable>
      )}
      {icons.includes('Docs') && (
        <Draggable>
          <div className="desktop-icon">
            <span role="img" aria-label="Docs">📄</span>
            <span>Docs</span>
          </div>
        </Draggable>
      )}
      {icons.includes('Calculator') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={openCalculator}>
            <span role="img" aria-label="Calculator">🧮</span>
            <span>Calculator</span>
          </div>
        </Draggable>
      )}
      {icons.includes('ControlPanel') && (
        <Draggable>
          <div className="desktop-icon" onDoubleClick={openControlPanel}>
            <span role="img" aria-label="ControlPanel">🪟</span>
            <span>WIND</span>
          </div>
        </Draggable>
      )}

      {/* Taskbar */}
      <div className="taskbar">
        <button className="start-button" onClick={toggleMenu}>
        🪟Start
        </button>

        {showMenu && (
          <div className="start-menu">
            <ConnectButton />
          </div>
        )}

        {/* Centered Text in Taskbar */}
        <div className="taskbar-text">🪟WinDAOs</div>

        {/* Clock in Taskbar */}
        <div className="clock">
          {time.toLocaleTimeString()}
        </div>
      </div>

      {/* Info App */}
      {showInfoApp && <InfoApp onClose={closeInfoApp} />}

      {/* Control Panel */}
      {showControlPanel && <ControlPanel onClose={closeControlPanel} />}

      {/* Airdrop App */}
      {showAirdrop && <Airdrop onClose={closeAirdrop} />}

      {/* Windows-style Popup for Staking and DAO */}
      {showPopup && (
        <div className="popup">
          <div className="popup-title-bar">
            <span>⚠️ Coming Soon</span>
            <button className="popup-close-btn" onClick={closePopup}>X</button>
          </div>
          <div className="popup-content">
            <div className="popup-body">
              This feature is coming soon!
            </div>
            <div className="popup-actions">
              <button onClick={closePopup}>Okay</button>
              <button onClick={closePopup}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Calculator App */}
      {showCalculator && (
        <div className="popup">
          <div className="popup-title-bar">
            <span>🧮 Calculator</span>
            <button className="popup-close-btn" onClick={closeCalculator}>X</button>
          </div>
          <div className="popup-content">
            <div className="calculator">
              <input type="text" value={input} readOnly className="calculator-display" />
              <div className="calculator-buttons">
                {[1, 2, 3, '+'].map(value => (
                  <button key={value} onClick={() => handleCalculatorInput(value.toString())}>{value}</button>
                ))}
                {[4, 5, 6, '-'].map(value => (
                  <button key={value} onClick={() => handleCalculatorInput(value.toString())}>{value}</button>
                ))}
                {[7, 8, 9, '*'].map(value => (
                  <button key={value} onClick={() => handleCalculatorInput(value.toString())}>{value}</button>
                ))}
                {['C', 0, '=', '/'].map(value => (
                  <button key={value} onClick={() => handleCalculatorInput(value.toString())}>{value}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post-it Note */}
      {showPostIt && (
        <Draggable>
          <div className="post-it">
            <div className="post-it-title-bar">
              <span>📌 Post-it Note</span>
              <button className="post-it-close-btn" onClick={closePostIt}>X</button>
            </div>
            <textarea value={postItText} onChange={(e) => setPostItText(e.target.value)} />
          </div>
        </Draggable>
      )}
    </div>
  );
}

export default App;
