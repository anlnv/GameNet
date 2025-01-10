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

import React, { useState, useEffect } from "react";
import "./info.css";

function Profile({ profileData }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [followersCount, setFollowersCount] = useState(null);
  const [followingCount, setFollowingCount] = useState(null);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'followers' or 'following'
  const [postContent, setPostContent] = useState(""); // Состояние для контента поста

  useEffect(() => {
    const fetchAvatar = async () => {
      if (profileData && profileData.id) {
        try {
          const response = await fetch(`http://87.242.103.34:5000/user/get-avatar?user_id=${profileData.id}`);
          const data = await response.json();

          if (data.avatar_url && data.avatar_url !== "no avatar") {
            setAvatarUrl(data.avatar_url); // Если аватар есть, сохраняем URL.
          } else {
            setAvatarUrl(null); // Если аватар не найден, показываем белый круг.
          }
        } catch (error) {
          console.error("Ошибка при загрузке аватара:", error);
          setAvatarUrl(null); // В случае ошибки показываем белый круг.
        }
      }
      setLoadingAvatar(false);
    };

    fetchAvatar();
  }, [profileData]);

  // Запросы для получения количества подписчиков и подписок
  useEffect(() => {
    const fetchFollowData = async () => {
      if (profileData && profileData.id) {
        try {
          // Получаем количество подписчиков
          const followersResponse = await fetch(`http://87.242.103.34:5000/user/${profileData.id}/followers`);
          const followersData = await followersResponse.json();
          setFollowersCount(Array.isArray(followersData) ? followersData.length : 0); // Проверяем, что это массив

          // Получаем количество подписок
          const followingResponse = await fetch(`http://87.242.103.34:5000/user/${profileData.id}/following`);
          const followingData = await followingResponse.json();
          setFollowingCount(Array.isArray(followingData) ? followingData.length : 0); // Проверяем, что это массив
        } catch (error) {
          console.error("Ошибка при загрузке данных о подписках:", error);
        }
      }
    };

    fetchFollowData();
  }, [profileData]);

  // Открытие попапа с подписчиками или подписками
  const openModal = (type) => {
    setModalType(type);
    if (type === "followers") {
      fetchFollowersList();
    } else if (type === "following") {
      fetchFollowingList();
    }
    setIsModalOpen(true);
  };

  // Получение списка подписчиков
  const fetchFollowersList = async () => {
    if (profileData && profileData.id) {
      try {
        const response = await fetch(`http://87.242.103.34:5000/user/${profileData.id}/followers`);
        const data = await response.json();
        setFollowersList(Array.isArray(data) ? data : []); // Убедитесь, что это массив
      } catch (error) {
        console.error("Ошибка при загрузке подписчиков:", error);
      }
    }
  };

  // Получение списка подписок
  const fetchFollowingList = async () => {
    if (profileData && profileData.id) {
      try {
        const response = await fetch(`http://87.242.103.34:5000/user/${profileData.id}/following`);
        const data = await response.json();
        setFollowingList(Array.isArray(data) ? data : []); // Убедитесь, что это массив
      } catch (error) {
        console.error("Ошибка при загрузке подписок:", error);
      }
    }
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Отправка запроса на создание поста
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    const postData = {
      title: "no title",  // Статичное значение для заголовка
      content: postContent,  // Контент из формы
    };

    try {
      const response = await fetch("http://87.242.103.34:5000/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Post created successfully:", result);
        setPostContent(""); // Очистить форму после успешного создания поста
      } else {
        console.error("Error creating post:", result);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
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
        <div className="profile__stat" onClick={() => openModal("followers")}>
          {followersCount} <p className="profile__stat-text">Followers</p>
        </div>
        <div className="profile__stat" onClick={() => openModal("following")}>
          {followingCount} <p className="profile__stat-text">Following</p>
        </div>
      </div>

      {/* Модальное окно с подписчиками и подписками */}
      {isModalOpen && (
        <div className="modal">
          <div className="modal__content">
            <button className="modal__close" onClick={closeModal}>X</button>
            <h2>{modalType === "followers" ? "Followers" : "Following"}</h2>
            <ul>
              {(modalType === "followers" ? followersList : followingList).map((user, index) => (
                <li key={index}>{user.username || user.email}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

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

export default Profile;
