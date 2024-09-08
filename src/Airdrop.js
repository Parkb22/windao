import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { useAccount } from 'wagmi';
import { db, collection, getDocs, doc, getDoc, setDoc } from './firebase';
import './Airdrop.css';

const Airdrop = ({ onClose }) => {
  const { address, isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState('info');
  const [points, setPoints] = useState(0);
  const [rank, setRank] = useState(0);
  const [referrals, setReferrals] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [referralLeaderboard, setReferralLeaderboard] = useState([]); // For Referral leaderboard
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastCheckIn, setLastCheckIn] = useState(null);
  const [telegramJoined, setTelegramJoined] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const usersPerPage = 10;

  useEffect(() => {
    if (isConnected && address) {
      const fetchUserData = async () => {
        try {
          const userDoc = doc(db, 'users', address);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setPoints(userData.points || 0);
            setRank(userData.rank || 0);
            setReferrals(userData.referrals || 0);
            setLastCheckIn(userData.lastCheckIn || null);
            setTelegramJoined(userData.telegramJoined || false);
            setReferralLink(`${window.location.origin}/?ref=${address}`);
          } else {
            await setDoc(userDoc, {
              points: 0,
              rank: 0,
              referrals: 0,
              lastCheckIn: null,
              telegramJoined: false,
              referredUsers: [],
            });
            setPoints(0);
            setRank(0);
            setReferrals(0);
            setLastCheckIn(null);
            setTelegramJoined(false);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUserData();
    }
  }, [isConnected, address]);

  // Fetch leaderboard sorted by points
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          address: doc.id,
        }));

        usersData.sort((a, b) => b.points - a.points); // Sort by points

        const userRank = usersData.findIndex((user) => user.address === address) + 1;
        setRank(userRank);

        setLeaderboard(usersData);
        setTotalParticipants(usersData.length);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
      }
    };

    fetchLeaderboardData();
  }, [address]);

  // Fetch leaderboard sorted by referrals
  useEffect(() => {
    const fetchReferralLeaderboardData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          address: doc.id,
        }));

        usersData.sort((a, b) => b.referrals - a.referrals); // Sort by referrals

        setReferralLeaderboard(usersData);
      } catch (error) {
        console.error('Error fetching referral leaderboard data:', error);
      }
    };

    fetchReferralLeaderboardData();
  }, []);

  const handleCheckIn = async () => {
    if (isConnected && address) {
      const currentTime = new Date();
      if (lastCheckIn && currentTime - new Date(lastCheckIn) < 24 * 60 * 60 * 1000) {
        setModalMessage('You can only check in once every 24 hours.');
        setShowModal(true);
        return;
      }

      try {
        const userDoc = doc(db, 'users', address);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          const newPoints = userData.points + 10;

          await setDoc(userDoc, {
            ...userData,
            points: newPoints,
            lastCheckIn: currentTime,
          });

          setPoints(newPoints);
          setLastCheckIn(currentTime);
          setModalMessage('Daily Check-in Successful! You earned 10 points.');
          setShowModal(true);
        }
      } catch (error) {
        console.error('Error during check-in:', error);
      }
    }
  };

  const handleTelegramJoin = () => {
    if (telegramJoined) {
      setModalMessage('You have already joined the Telegram.');
      setShowModal(true);
      return;
    }

    window.open('https://t.me', '_blank', 'width=600,height=400');
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const totalPages = Math.ceil(leaderboard.length / usersPerPage);
  const displayedUsers = leaderboard.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const referralTotalPages = Math.ceil(referralLeaderboard.length / usersPerPage);
  const displayedReferralUsers = referralLeaderboard.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const isCheckInEligible = !lastCheckIn || new Date() - new Date(lastCheckIn) >= 24 * 60 * 60 * 1000;

  return (
    <Draggable>
      <div className="airdrop-panel">
        <div className="airdrop-title-bar">
          <span>🪂 Airdrop</span>
          <button className="airdrop-close-btn" onClick={onClose}>X</button>
        </div>
        <div className="airdrop-tabs">
          <button
            onClick={() => setActiveTab('info')}
            className={activeTab === 'info' ? 'active' : ''}
          >
            Info
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={activeTab === 'tasks' ? 'active' : ''}
          >
            Tasks
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={activeTab === 'leaderboard' ? 'active' : ''}
          >
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={activeTab === 'referrals' ? 'active' : ''}
          >
            Referrals
          </button>
        </div>
        <div className="airdrop-content">
          {!isConnected ? (
            <div className="airdrop-body">
              <span>⚠️ Please connect your wallet to proceed.</span>
            </div>
          ) : (
            <>
              {activeTab === 'info' && (
                <div className="airdrop-body">
                  <div className="info-section">
                    <p><span>Wallet Address:</span> {`${address.slice(0, 6)}...${address.slice(-4)}`}</p>
                    <p><span>My Points:</span> {points}</p>
                    <p><span>My Rank:</span> #{rank}</p>
                    <p>
                      <span>My Referrals:</span> {referrals}
                    </p>
                  </div>
                </div>
              )}
              {activeTab === 'tasks' && (
                <div className="airdrop-body">
                  <div className="task-container">
                    <div className="task-info">
                      <p><strong>Daily Check-in</strong></p>
                      <p>Earn 10 points by checking in today</p>
                    </div>
                    <button
                      className="task-btn"
                      onClick={handleCheckIn}
                      disabled={!isCheckInEligible}
                      style={{
                        backgroundColor: isCheckInEligible ? 'green' : 'gray',
                      }}
                    >
                      Go
                    </button>
                  </div>
                  <div className="task-container">
                    <div className="task-info">
                      <p><strong>Join the WinDAOs Telegram</strong></p>
                      <p>Earn 10 points by joining our community</p>
                    </div>
                    {!telegramJoined && (
                      <button className="task-btn" onClick={handleTelegramJoin}>
                        Go
                      </button>
                    )}
                    {telegramJoined && (
                      <button
                        className="task-btn"
                        style={{ backgroundColor: 'gray' }}
                      >
                        Completed
                      </button>
                    )}
                  </div>
                </div>
              )}
              {activeTab === 'leaderboard' && (
                <div className="airdrop-body">
                  <p>Total Participants: {totalParticipants}</p>
                  <ul className="leaderboard-list">
                    {displayedUsers.map((user, index) => (
                      <li key={user.address}>
                        #{(currentPage - 1) * usersPerPage + index + 1}:{' '}
                        {`${user.address.slice(0, 6)}...${user.address.slice(
                          -4
                        )}`} - {user.points} points
                      </li>
                    ))}
                  </ul>
                  <div className="pagination">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {activeTab === 'referrals' && (
                <div className="airdrop-body">
                  <p>The more you refer, the more you earn! <br />Referrals come from a different airdrop pool!</p>
                  <div className="info-section">
                    <p><strong>Your Referral Link:</strong></p>
                    <input type="text" value={referralLink} readOnly />
                    <button
                      className="task-btn copy-btn"
                      onClick={handleCopyReferralLink}
                    >
                      Copy
                    </button>
                    {copySuccess && (
                      <div className="modal">
                        <div className="modal-content">
                          <span>Copied!</span>
                          <button onClick={() => setCopySuccess(false)}>
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  <p><strong>My Referrals:</strong> {referrals}</p>
                  <ul className="leaderboard-list">
                    {displayedReferralUsers.map((user, index) => (
                      <li key={user.address}>
                        {index + 1}:{' '}
                        {`${user.address.slice(0, 6)}...${user.address.slice(
                          -4
                        )}`} - {user.referrals} referrals
                      </li>
                    ))}
                  </ul>
                  <div className="pagination">
                    <button
                      onClick={goToPrevPage}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === referralTotalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span>{modalMessage}</span>
              <button onClick={() => setShowModal(false)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default Airdrop;
