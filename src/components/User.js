import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./info.css";
import CloseButtonIcon from "../images/close-button.svg";
import { FaDiscord, FaSteam, FaTelegram } from "react-icons/fa";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function User({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); 


  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);

  const [showAllGames, setShowAllGames] = useState(false);
  const displayedGames = showAllGames ? games : games.slice(0, 12);



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
          `${API_BASE_URL}/ext/steam/${userData.id}/games`,
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
          return;
        }

        const getError = await getResponse.json();
        if (getError.detail === 'No data for this user') {
          const postResponse = await fetch(
            `${API_BASE_URL}/ext/steam/${userData.id}/`,
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
            `${API_BASE_URL}/ext/steam/${userData.id}/games`,
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
  }, [userData]);

  useEffect(() => {
    if (!userId) navigate("/home");
    if (userData && userData.id === currentUser?.id) {
      navigate("/profile");
    }
  }, [userData, currentUser, navigate]);


  const fetchUserData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setUserData(data);
        const avatarResponse = await fetch(
          `${API_BASE_URL}/user/${userId}/avatar`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const avatarData = await avatarResponse.json();
        setAvatarUrl(
          avatarData.avatar_url !== "no avatar" ? avatarData.avatar_url : null
        );

        const followersResponse = await fetch(
          `${API_BASE_URL}/user/${userId}/followers`
        );
        const followersData = await followersResponse.json();
        setFollowersCount(followersData.users?.length || 0);
        setFollowersList(followersData.users || []);

        const followingResponse = await fetch(
          `${API_BASE_URL}/user/${userId}/following`
        );
        const followingData = await followingResponse.json();
        setFollowingCount(followingData.users?.length || 0);
        setFollowingList(followingData.users || []);
        setCommunityList(followingData.communities || []);

        const isFollowedResponse = await fetch(
          `${API_BASE_URL}/user/${currentUser?.id}/following`
        );
        const followingDataCheck = await isFollowedResponse.json();
        const isFollowed = followingDataCheck.users.some(
          (user) => user.id === parseInt(userId, 10)
        );
        setIsFollowing(isFollowed);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  // Обработка подписки/отписки
  const handleToggleFollow = async () => {
    try {
      const action = isFollowing ? "unfollow" : "follow";
      const method = isFollowing ? "DELETE" : "POST";

      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/${action}`,
        {
          method: method,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to toggle follow");

      setIsFollowing(!isFollowing);
      setFollowersCount(
        isFollowing
          ? followersCount - 1
          : followersCount + 1
      );



      const updatedFollowingResponse = await fetch(
        `${API_BASE_URL}/user/${currentUser?.id}/following`
      );
      const updatedFollowingData = await updatedFollowingResponse.json();
      const isFollowedNow = updatedFollowingData.users.some(
        (user) => user.id === parseInt(userId, 10)
      );
      setIsFollowing(isFollowedNow);

      const updatedFollowersResponse = await fetch(
        `${API_BASE_URL}/user/${userId}/followers`
      );
      const updatedFollowersData = await updatedFollowersResponse.json();
      setFollowersCount(updatedFollowersData.users?.length || 0);
    } catch (error) {
      console.error("Toggle follow error:", error);
      setIsFollowing(prev => prev); 
    }
  };

  
  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleProfileRedirect = (type, id) => {
    const path = type === "user" ? `/user/${id}` : `/community/${id}`;
    navigate(path);
    closeModal();
  };

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  const age = userData.dob ? calculateAge(userData.dob) : "";
  const contacts = [
    { platform: "Discord", icon: <FaDiscord />, username: userData.contacts?.discord || "" },
    { platform: "Steam", icon: <FaSteam />, username: userData.contacts?.steam || "" },
    { platform: "Telegram", icon: <FaTelegram />, username: userData.contacts?.telegram || "" },
  ];

  return (
    <div className="profile">
      <div className="profile__info">
        <div
          className="profile__avatar"
          style={{
            backgroundImage: avatarUrl
              ? `url(${avatarUrl})`
              : "none",
          }}
        >
          {!avatarUrl && <span className="profile__avatar_text">No avatar</span>}
        </div>
        <div className="profile__text">
          <p className="profile__text_name">{userData.username}</p>
          <p className="profile__pesonal">
            <span className="profile__gender">
              {userData.gender || "Не указан"}
            </span>
            <span className="profile__age">{userData.dob ? `, ${age}` : " "}</span>
          </p>
          <p className="profile__bio">{userData.description || ""}</p>
        </div>
      </div>

      <div className="profile__actions">
        {userData.id !== currentUser?.id && (
          <button
            className="profile__button"
            onClick={handleToggleFollow}
            disabled={loading}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="profile__stats">
        <div
          className="profile__stat"
          onClick={() => openModal("followers")}
        >
          {followersCount} <p className="profile__stat-text">Followers</p>
        </div>
        <div
          className="profile__stat"
          onClick={() => openModal("following")}
        >
          {followingCount} <p className="profile__stat-text">Following</p>
        </div>
        <div
          className="profile__stat"
          onClick={() => openModal("communities")}
        >
          {games.length} <p className="profile__stat-text">Games</p>
        </div>
      </div>

      {games?.length > 0 && (
        <section className="section">
          <h2 className="section-title">Games</h2>
          <div className="games-container">
            {displayedGames.map((game, index) => (
              <div key={index} className="game-item">
                {game}
              </div>
            ))}
          </div>
          {games.length > 12 && (
            <button
              className="show-more-btn"
              onClick={() => setShowAllGames(!showAllGames)}
            >
              {showAllGames ? "Show less" : "Show all"}
              <span className={`arrow ${showAllGames ? "up" : "down"}`} />
            </button>
          )}
        </section>
      )}

      <div className="section">
        <ul className="contacts__list">
          {userData.contacts && contacts.map((contact, index) => (
            <li key={index} className="contacts__item">
              <span className="contacts__icon">{contact.icon}</span>
              <span className="contacts__username">{contact.username}</span>
            </li>
          ))}
        </ul>
      </div>


      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
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
                    onClick={(e) => handleProfileRedirect("user", user.id)}
                    className="clickable"
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "following" &&
                followingList.map((user) => (
                  <li
                    key={user.id}
                    onClick={(e) => handleProfileRedirect("user", user.id)}
                    className="clickable"
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "communities" &&
                communityList.map((community) => (
                  <li
                    key={community.id}
                    onClick={(e) => handleProfileRedirect("community", community.id)}
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

export default User;