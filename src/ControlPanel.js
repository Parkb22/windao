import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import './ControlPanel.css';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

const ControlPanel = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('presale');
  const [ethBalance, setEthBalance] = useState(0);
  const [percentage, setPercentage] = useState(0);
  const [ethToSpend, setEthToSpend] = useState('');
  const [windToReceive, setWindToReceive] = useState(0);
  const [tier, setTier] = useState('Bronze');
  const [ethHolding, setEthHolding] = useState(0);

  const presaleAddress = '0x680EA22EbaD1F85Fc7cB88780E92cab3DAa04b36';
  const presaleLimit = 100; // 100 ETH for presale
  const totalWindSupply = 1000000000; // 1 Billion WIND
  const presaleAllocation = 100000000; // 100 Million WIND for presale
  const windPerEth = 1000000; // 1 ETH = 1 Million WIND

  useEffect(() => {
    if (isConnected) {
      const provider = new ethers.JsonRpcProvider('https://sepolia.infura.io/v3/2f6f602973ad4ca69e282247f0d14c37');

      provider.getBalance(presaleAddress).then((balance) => {
        const ethValue = parseFloat(ethers.formatEther(balance)); 
        setEthBalance(ethValue);
        setPercentage((ethValue / presaleLimit) * 100);
      }).catch((err) => {
        console.error("Failed to fetch balance", err);
      });

      const userEthHolding = 50000; // Placeholder value for WIND holdings
      setEthHolding(userEthHolding);

      if (userEthHolding >= 20000001) setTier('Legendary');
      else if (userEthHolding >= 10000001) setTier('Diamond');
      else if (userEthHolding >= 1000001) setTier('Platinum');
      else if (userEthHolding >= 100001) setTier('Gold');
      else if (userEthHolding >= 10001) setTier('Silver');
      else setTier('Bronze');
    }
  }, [isConnected, address]);

  const handleEthChange = (e) => {
    const eth = e.target.value;
    setEthToSpend(eth);
    const wind = eth * windPerEth;
    setWindToReceive(wind);
  };

  const handleBuyWind = async () => {
    if (!window.ethereum || !ethToSpend || ethToSpend <= 0) {
      alert('Please enter a valid ETH amount and make sure you have MetaMask installed.');
      return;
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    try {
      const tx = await signer.sendTransaction({
        to: presaleAddress,
        value: ethers.parseEther(ethToSpend)
      });

      await tx.wait();
      alert(`Transaction successful! You have purchased ${windToReceive} WIND tokens.`);
      setEthToSpend('');
      setWindToReceive(0);
    } catch (error) {
      console.error('Error purchasing WIND:', error);
      alert('Transaction failed.');
    }
  };

  return (
    <Draggable>
      <div className="control-panel">
        <div className="control-panel-title-bar">
          <span>🪟 WIND tokens</span>
          <button className="control-panel-close-btn" onClick={onClose}>X</button>
        </div>

        <div className="control-panel-tabs">
          <button
            onClick={() => setActiveTab('presale')}
            className={activeTab === 'presale' ? 'active' : ''}
          >
            Presale
          </button>
          <button
            onClick={() => setActiveTab('myinfo')}
            className={activeTab === 'myinfo' ? 'active' : ''}
          >
            My Info
          </button>
          <button
            onClick={() => setActiveTab('mybenefits')}
            className={activeTab === 'mybenefits' ? 'active' : ''}
          >
            My Benefits
          </button>
        </div>

        <div className="control-panel-content">
          {activeTab === 'presale' && (
            <div className="control-panel-body">
              <p style={{ color: '#007bff' }}>Presale Progress: {ethBalance} / {presaleLimit} ETH</p>
              <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: `${percentage}%` }}>
                  <span className="progress-label">{Math.round(percentage)}%</span>
                </div>
              </div>
              <div className="tokenomics-section">
                <p style={{ color: '#28a745' }}>Total WIND Supply: {totalWindSupply.toLocaleString()} WIND</p>
                <p style={{ color: '#ffc107' }}>Total Presale Allocation: {presaleAllocation.toLocaleString()} WIND</p>
                <p style={{ color: '#dc3545' }}>Presale Price: 1 ETH = {windPerEth.toLocaleString()} WIND</p>
              </div>

              <div className="buy-section">
                <input
                  type="number"
                  value={ethToSpend}
                  onChange={handleEthChange}
                  placeholder="Amount of ETH"
                  className="eth-input"
                />
                <p>You will receive: {windToReceive.toLocaleString()} WIND</p>
                <button className="buy-wind-btn" onClick={handleBuyWind}>
                  Buy WIND
                </button>
              </div>
            </div>
          )}

          {activeTab === 'myinfo' && (
            <div className="control-panel-body">
              <p>
                <strong>My Address:</strong> 
                <a 
                  href={`https://etherscan.io/address/${address}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: '#007bff' }}
                >
                  {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
                </a>
              </p>
              <p><strong>My WIND:</strong> {ethHolding.toLocaleString()} WIND</p>
              <p><strong>My Tier:</strong> {tier}</p>
            </div>
          )}

          {activeTab === 'mybenefits' && (
            <div className="control-panel-body coming-soon-section">
              <p>Coming Soon</p>
            </div>
          )}
        </div>
      </div>
    </Draggable>
  );
};

export default ControlPanel;
