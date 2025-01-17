/*import React, { useState, useEffect } from "react";
import "./info.css";

function Profile({ profileData }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);

  useEffect(() => {
    const fetchAvatar = async () => {
      if (profileData && profileData.id) {
        try {
          const response = await fetch(`http://87.242.103.34:5000/user/get-avatar?user_id=${profileData.id}`);
          const data = await response.json();

          if (data.avatar_url && data.avatar_url !== "no avatar") {
            setAvatarUrl(data.avatar_url); // Если аватар есть, сохраняем URL.
          } else {
            setAvatarUrl(null); // Если аватар не найден, будем показывать белый круг.
          }
        } catch (error) {
          console.error("Ошибка при загрузке аватара:", error);
          setAvatarUrl(null); // В случае ошибки тоже показываем белый круг.
        }
      }
      setLoadingAvatar(false);
    };

    fetchAvatar();
  }, [profileData]);

  if (!profileData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile">
      <div className="profile__info">
        {loadingAvatar ? (
          <div className="profile__avatar_loading">Загрузка...</div>
        ) : (
          <div
            className="profile__avatar"
            style={{
              backgroundImage: avatarUrl ? `url(${avatarUrl})` : 'none',
            }}
          >
            {!avatarUrl && <span className="profile__avatar_text">No avatar</span>}
          </div>
        )}
        <div className="profile__text">
          <p className="profile__text_name">{profileData.username}</p>
          <p className="profile__text_nick">{profileData.email}</p>
        </div>
      </div>
      <div className="profile__actions">
        <button className="profile__button">Follow</button>
      </div>
      <div className="profile__stats">
        <div className="profile__stat">
          1.2K<p className="profile__stat-text">Followers</p>
        </div>
        <div className="profile__stat">
          2.3K<p className="profile__stat-text">Following</p>
        </div>
      </div>
      <h2>User Information</h2>
      <div className="profile__details">
        <div className="profile__details-grid">
          <p className="profile__detail">
            <strong>Gender:</strong> {profileData.gender || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Purpose:</strong> {profileData.purpose || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Preferred Communication:</strong>{" "}
            {profileData.preferred_communication || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Hours Per Week:</strong> {profileData.hours_per_week || "0"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;*/

/*import React, { useState, useEffect } from "react";
import "./info.css";
import CloseButtonIcon from "../images/close-button.svg"; 

function Profile({ profileData }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'followers', 'following', or 'communities'

  useEffect(() => {
    const fetchAvatar = async () => {
      if (profileData && profileData.id) {
        try {
          const response = await fetch(`http://87.242.103.34:5000/user/get-avatar?user_id=${profileData.id}`);
          const data = await response.json();

          if (data.avatar_url && data.avatar_url !== "no avatar") {
            setAvatarUrl(data.avatar_url);
          } else {
            setAvatarUrl(null);
          }
        } catch (error) {
          console.error("Ошибка при загрузке аватара:", error);
          setAvatarUrl(null);
        }
      }
      setLoadingAvatar(false);
    };

    fetchAvatar();
  }, [profileData]);

  useEffect(() => {
    const fetchFollowData = async () => {
      if (profileData && profileData.id) {
        try {
          // Fetch followers
          const followersResponse = await fetch(`http://87.242.103.34:5000/user/${profileData.id}/followers`);
          const followersData = await followersResponse.json();
          setFollowersCount(Array.isArray(followersData.users) ? followersData.users.length : 0);
          setFollowersList(Array.isArray(followersData.users) ? followersData.users : []);

          // Fetch following and communities
          const followingResponse = await fetch(`http://87.242.103.34:5000/user/${profileData.id}/following`);
          const followingData = await followingResponse.json();
          setFollowingCount(Array.isArray(followingData.users) ? followingData.users.length : 0);
          setCommunityCount(Array.isArray(followingData.communities) ? followingData.communities.length : 0);
          setFollowingList(Array.isArray(followingData.users) ? followingData.users : []);
          setCommunityList(Array.isArray(followingData.communities) ? followingData.communities : []);
        } catch (error) {
          console.error("Ошибка при загрузке данных о подписках:", error);
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

  if (!profileData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile">
      <div className="profile__info">
        {loadingAvatar ? (
          <div className="profile__avatar_loading">Загрузка...</div>
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
          <p className="profile__text_nick">{profileData.email}</p>
        </div>
      </div>
      <div className="profile__stats">
        <div className="profile__stat" onClick={() => openModal("followers")}>
          {followersCount} <p className="profile__stat-text">Followers</p>
        </div>
        <div className="profile__stat" onClick={() => openModal("following")}>
          {followingCount} <p className="profile__stat-text">Following</p>
        </div>
        <div className="profile__stat" onClick={() => openModal("communities")}>
          {communityCount} <p className="profile__stat-text">Communities</p>
        </div>
      </div>

      <h2>User Information</h2>
      <div className="profile__details">
        <div className="profile__details-grid">
          <p className="profile__detail">
            <strong>Gender:</strong> {profileData.gender || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Purpose:</strong> {profileData.purpose || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Preferred Communication:</strong>{" "}
            {profileData.preferred_communication || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Hours Per Week:</strong> {profileData.hours_per_week || "0"}
          </p>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal__content">
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
                followersList.map((user) => <li key={user.id}>{user.username}</li>)}
              {modalType === "following" &&
                followingList.map((user) => <li key={user.id}>{user.username}</li>)}
              {modalType === "communities" &&
                communityList.map((community) => <li key={community.id}>{community.name}</li>)}
            </ul>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./info.css";
import CloseButtonIcon from "../images/close-button.svg";

function Profile({ profileData }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'followers', 'following', or 'communities'
  const navigate = useNavigate();

  // Fetch avatar
useEffect(() => {
  const fetchAvatar = async () => {
    if (profileData && profileData.id) {
      try {
        const response = await fetch(
          `http://87.242.103.34:5000/user/${profileData.id}/get-avatar?user_id=${profileData.id}`
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
            `http://87.242.103.34:5000/user/${profileData.id}/followers`
          );
          const followersData = await followersResponse.json();
          setFollowersCount(followersData.users?.length || 0);
          setFollowersList(followersData.users || []);

          const followingResponse = await fetch(
            `http://87.242.103.34:5000/user/${profileData.id}/following`
          );
          const followingData = await followingResponse.json();
          setFollowingCount(followingData.users?.length || 0);
          setCommunityCount(followingData.communities?.length || 0);
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
          <p className="profile__text_nick">{profileData.email}</p>
        </div>
      </div>

      <div className="profile__stats">
        <div className="profile__stat" onClick={() => openModal("followers")}>
          {followersCount} <p className="profile__stat-text">Followers</p>
        </div>
        <div className="profile__stat" onClick={() => openModal("following")}>
          {followingCount} <p className="profile__stat-text">Following</p>
        </div>
        <div className="profile__stat" onClick={() => openModal("communities")}>
          {communityCount} <p className="profile__stat-text">Communities</p>
        </div>
      </div>

      <h2>User Information</h2>
      <div className="profile__details">
        <div className="profile__details-grid">
          <p className="profile__detail">
            <strong>Self assesmemt level:</strong> {profileData.info.self_assessment_lvl || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Purpose:</strong> {profileData.info.purpose || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Preferred Communication:</strong>{" "}
            {profileData.info.preferred_communication || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Hours Per Week:</strong> {profileData.info.hours_per_week || "0"}
          </p>
        </div>
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
