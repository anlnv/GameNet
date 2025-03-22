import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./info.css";
import CloseButtonIcon from "../images/close-button.svg";
import { FaDiscord, FaSteam, FaTelegram } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Profile({ profileData }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'followers', 'following', or 'communities'
  const navigate = useNavigate();

  
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const gamesCount = games.length;

  const [showAllGames, setShowAllGames] = useState(false);
  const allGames = [
    "Cyber Adventure", "Space Warriors", "Magic Quest", 
    "Dragon Realm", "Racing Pro", "Zombie Survival",
    "Mystery Island", "Football Stars", "Cooking Fever",
    "City Builder", "Alien Invasion", "Puzzle Master", 
    "Dragon Realm", "Racing Pro", "Zombie Survival",
    "Mystery Island", "Football Stars", "Cooking Fever",
  ];
  const displayedGames = showAllGames ? games : games.slice(0, 12);

    const contacts = [
      { platform: "Discord", icon: <FaDiscord />, username: profileData.contacts.discord },
      { platform: "Steam", icon: <FaSteam />, username: profileData.contacts.steam },
      { platform: "Telegram", icon: <FaTelegram />, username: profileData.contacts.telegram },
    ];

    const age = profileData.dob ? calculateAge(profileData.dob) : "";




  // Fetch avatar
useEffect(() => {
  const fetchAvatar = async () => {
    if (profileData && profileData.id) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/user/${profileData.id}/avatar`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch avatar");
        }
        const data = await response.json();
        setAvatarUrl(data.avatar_url !== "no avatar" ? data.avatar_url : null);
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setAvatarUrl(null);
      }
    }
    setLoadingAvatar(false);
  };
  fetchAvatar();
}, [profileData]);


  // Fetch followers, following, and communities
  useEffect(() => {
    const fetchFollowData = async () => {
      if (profileData && profileData.id) {
        try {
          const followersResponse = await fetch(
            `${API_BASE_URL}/user/${profileData.id}/followers`
          );
          const followersData = await followersResponse.json();
          setFollowersCount(followersData.users?.length || 0);
          setFollowersList(followersData.users || []);

          const followingResponse = await fetch(
            `${API_BASE_URL}/user/${profileData.id}/following`
          );
          const followingData = await followingResponse.json();
          setFollowingCount(followingData.users?.length || 0);
          setFollowingList(followingData.users || []);
          setCommunityList(followingData.communities || []);
        } catch (error) {
          console.error("Error fetching follow data:", error);
        }
      }
    };
    fetchFollowData();
  }, [profileData]);


  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNameClick = (type, id) => {
    const path = type === "user" ? `/user/${id}` : `/community/${id}`;
    navigate(path);
  };

  function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const getResponse = await fetch(
          `${API_BASE_URL}/ext/steam/${profileData.id}/games`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
  
        if (getResponse.ok) {
          const data = await getResponse.json();
          setGames(data || []);
          setLoading(false);
          console.log(data)
          return;
        }
  
        const getError = await getResponse.json();
        if (getError.detail === 'No data for this user') {
          // 3. Делаем POST для подключения
          const postResponse = await fetch(
            `${API_BASE_URL}/ext/steam/${profileData.id}/`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
  
          if (!postResponse.ok) {
            const postError = await postResponse.json();
            if (postError.detail === 'No data for this user') {
              setError('Steam не подключен');
            } else {
              setError('Ошибка при подключении Steam');
            }
            setLoading(false);
            return;
          }
  
          const secondGetResponse = await fetch(
            `${API_BASE_URL}/ext/steam/${profileData.id}/games`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            }
          );
  
          if (secondGetResponse.ok) {
            const data = await secondGetResponse.json();
            setGames(data || []);
          } else {
            setError('Steam не подключен');
          }
        } else {
          setError('Неизвестная ошибка');
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchGames();
    console.log(games)
  }, [profileData]);



  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile">
      <div className="profile__info">
        {loadingAvatar ? (
          <div className="profile__avatar_loading">Loading...</div>
        ) : (
          <div
            className="profile__avatar"
            style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none" }}
          >
            {!avatarUrl && <span className="profile__avatar_text">No avatar</span>}
          </div>
        )}
        <div className="profile__text">
          <p className="profile__text_name">{profileData.username}</p>
          <p className="profile__pesonal">
            <span className="profile__gender">{profileData.gender || "Не указан"}</span>
            <span className="profile__age">{profileData.dob ? `, ${age}` : " "}</span>
          </p>
          <p className="profile__bio">{profileData.description || " "}</p>
        </div>
      </div>

     

      <div className="profile__stats">
        <div className="profile__stat" onClick={() => openModal("followers")}>
          {followersCount} <p className="profile__stat-text">Followers</p>
        </div>
        <div className="profile__stat" onClick={() => openModal("following")}>
          {followingCount} <p className="profile__stat-text">Following</p>
        </div>
        <div className="profile__stat">
          {gamesCount}<p className="profile__stat-text">Games</p>
        </div>
      </div>


        <section className="section">
          <h2 className="section-title">Games</h2>
          <div className="games-container">
            {displayedGames.map((game, index) => (
              <div key={index} className="game-item">
                {game}
              </div>
            ))}
          </div>
          {allGames.length > 12 && (
            <button
              className="show-more-btn"
              onClick={() => setShowAllGames(!showAllGames)}
            >
              {showAllGames ? "Show less" : "Show all"}
              <span className={`arrow ${showAllGames ? "up" : "down"}`} />
            </button>
          )}
        </section>
      
        <div className="section">
      <ul className="contacts__list">
        {contacts.map((contact, index) => (
          <li key={index} className="contacts__item">
            <span className="contacts__icon">{contact.icon}</span>
            <span className="contacts__username">{contact.username}</span>
          </li>
        ))}
      </ul>
    </div>
      

      {isModalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={closeModal}>
              <img src={CloseButtonIcon} alt="Close" />
            </button>
            <h2>
              {modalType === "followers"
                ? "Followers"
                : modalType === "following"
                ? "Following"
                : "Communities"}
            </h2>
            <ul>
              {modalType === "followers" &&
                followersList.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleNameClick("user", user.id)}
                    className="clickable"
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "following" &&
                followingList.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleNameClick("user", user.id)}
                    className="clickable"
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "communities" &&
                communityList.map((community) => (
                  <li
                    key={community.id}
                    onClick={() => handleNameClick("community", community.id)}
                    className="clickable"
                  >
                    {community.name}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;

