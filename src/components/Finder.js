import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './finder.css';
import games from "./games";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Finder({ profileData }) {
  const navigate = useNavigate();
  const [gamesList, setGamesList] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");

  useEffect(() => {
    setGamesList(games);
  }, []);

  const fetchRecommendedUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const params = new URLSearchParams();
      if (selectedGame) params.append("game", selectedGame);
      if (selectedPurpose) params.append("purpose", selectedPurpose);
      
      const url = `${API_BASE_URL}/recommendations/${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) throw new Error("Failed to fetch recommendations");
      
      const data = await response.json();
      setRecommendedUsers(data.slice(0, 4));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setShowRecommendations(true);
    }
  };

  const handleFilterChange = (field, value) => {
    switch (field) {
      case 'game':
        setSelectedGame(value);
        break;
      case 'purpose':
        setSelectedPurpose(value);
        break;
      default:
        return;
    }
  };

  const handleFindClick = () => {
    fetchRecommendedUsers();
  };

  const handleProfileRedirect = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="finder-container">
      <div className="filter-sidebar">
        <h2>Filters</h2>
        <div className="filter-group">
          <label htmlFor="gameFilter">Game:</label>
          <select 
            id="gameFilter" 
            value={selectedGame} 
            onChange={(e) => handleFilterChange('game', e.target.value)}
          >
            <option value="">All games</option>
            {gamesList.map((game, index) => (
              <option key={index} value={game}>{game}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="purposeFilter">Purpose:</label>
          <select 
            id="purposeFilter" 
            value={selectedPurpose} 
            onChange={(e) => handleFilterChange('purpose', e.target.value)}
          >
            <option value="">All purposes</option>
            <option value="fun">For fun</option>
            <option value="result">For result</option>
          </select>
        </div>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>Find your teammates</h2>
          <button className="find-btn" onClick={handleFindClick}>
            Find
          </button>
        </div>

        {showRecommendations && (
          <div className="recommendations">
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {recommendedUsers.length === 0 && !loading && !error && (
              <p className="no-results">No teammates found</p>
            )}
            <ul>
              {recommendedUsers.map(({ user, compatibility_score }) => (
                <li key={user.id} className="user-item">
                  <div className="user-profile" onClick={() => handleProfileRedirect(user.id)}>
                    <img 
                      className="user-avatar" 
                      src={user.avatar_url !== "empty" ? user.avatar_url : "/default-avatar.png"} 
                      alt="User avatar" 
                    />
                    <div className="user-details">
                      <span className="username">{user.username}</span>
                      <span className="compatibility">Compatibility: {compatibility_score.toFixed(2)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default Finder;
