/*import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Изменено на useNavigate
import './finder.css';

function Finder({ profileData }) {
  const navigate = useNavigate(); // Используем useNavigate для навигации
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const userId = profileData.id; // Идентификатор текущего пользователя

  const fetchRecommendedUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      // Новый запрос с user_id в URL
      const response = await fetch(`http://46.149.72.161:5000/rs/${userId}/find`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch recommended users");
      }

      const data = await response.json();
      setRecommendedUsers(data.mates); // Данные пользователей в mates
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLetsGoClick = () => {
    fetchRecommendedUsers();
    setShowRecommendations(true);
  };

  const handleAddFriend = (userName) => {
    alert(`${userName} added as a friend!`);
  };

  const handleProfileRedirect = (userId) => {
    navigate(`/user/${userId}`); // Перенаправление на страницу профиля
  };

  return (
    <div className="finder">
      <h1>Find your teammates</h1>
      {!showRecommendations ? (
        <button className="lets-go-btn" onClick={handleLetsGoClick}>
          Let's go
        </button>
      ) : (
        <div className="recommendations">
          <h2>Recommended Users</h2>
          {loading && <p>Loading...</p>}
          {error && <p className="error-message">{error}</p>}
          <ul>
            {recommendedUsers.map((user, index) => (
              <li key={index} className="user-item">
                <div className="user-info">
                  <span 
                    className="username" 
                    onClick={() => handleProfileRedirect(user.user_id)} // Обработчик клика на имя
                  >
                    {user.username}
                  </span>
                  <span className="user-score">{user.score}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Finder;*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './finder.css';
import games from "./games";

function Finder({ profileData }) {
  const navigate = useNavigate();
  const [gamesList, setGamesList] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("");

  const userId = profileData.id;

  // Загрузка списка игр (пример)
  useEffect(() => {
    setGamesList(games);
  }, []);

  const fetchRecommendedUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in.");

      const params = new URLSearchParams({
        game: selectedGame,
        purpose: selectedPurpose
      });

      const response = await fetch(
        `http://46.149.72.161:5000/rs/${userId}/find?${params.toString()}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (!response.ok) throw new Error("Failed to fetch recommendations");
      
      const data = await response.json();
      setRecommendedUsers(data.mates);
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
    if (!selectedGame || !selectedPurpose) {
      setError("Please select both filters");
      return;
    }
    fetchRecommendedUsers();
  };

  const handleProfileRedirect = (userId) => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="finder-container">
      {/* Левая панель с фильтрами */}
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
              <option key={index} value={game}>
                {game}
              </option>
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
            <option value="casual">Casual</option>
            <option value="competitive">Competitive</option>
            <option value="clan">Clan activities</option>
          </select>
        </div>
      </div>

      {/* Центральная панель с поиском и результатами */}
      <div className="main-content">
        <div className="header">
          <h1>Find your teammates</h1>
          <button 
            className="find-btn" 
            onClick={handleFindClick}
            disabled={!selectedGame || !selectedPurpose}
          >
            Find
          </button>
        </div>

        {showRecommendations && (
          <div className="recommendations">
            <h2>Recommended Users</h2>
            {loading && <p className="loading">Loading...</p>}
            {error && <p className="error-message">{error}</p>}
            {recommendedUsers.length === 0 && !loading && !error && (
              <p className="no-results">No teammates found</p>
            )}
            <ul>
              {recommendedUsers.map(user => (
                <li key={user.id} className="user-item">
                  <div 
                    className="user-profile" 
                    onClick={() => handleProfileRedirect(user.id)}
                  >
                    <img 
                      className="user-avatar" 
                      src={user.avatar || "/default-avatar.png"} 
                      alt="User avatar"
                    />
                    <div className="user-details">
                      <span className="username">{user.username}</span>
                      <span className="purpose">{user.purpose}</span>
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
