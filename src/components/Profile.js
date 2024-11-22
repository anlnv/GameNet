/*import { useState, useEffect } from "react";
import avatar from '../images/avatar.jpg';

function Profile() {
  const [profileData, setProfileData] = useState(null);  // Состояние для данных профиля
  const [loading, setLoading] = useState(true);  // Состояние для отслеживания загрузки данных
  const [error, setError] = useState(null);  // Состояние для ошибок

  useEffect(() => {
    // Функция для запроса данных пользователя с сервера
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://87.242.103.34:5000/user/me', {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ2b3ZhIiwiZXhwIjoxNzM0ODc2MTIwfQ.RTvB3BkqKA9ngVYrE2aqUz0PMrUWmcGZFjXG2suPoSU',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить данные');
        }

        const data = await response.json();
        setProfileData(data);  // Сохраняем полученные данные
      } catch (error) {
        setError(error.message);  // Обработка ошибки
      } finally {
        setLoading(false);  // Завершаем загрузку
      }
    };

    fetchProfileData();
  }, []);  // Пустой массив, чтобы запрос выполнялся только один раз при загрузке компонента

  if (loading) {
    return <div>Загрузка...</div>;  // Показываем загрузку, пока данные не получены
  }

  if (error) {
    return <div>Ошибка: {error}</div>;  // Отображаем ошибку, если запрос не удался
  }

  return (
    <div className="profile">
      <div className="profile__info">
        <img className="profile__avatar" alt="avatar" src={avatar} />
        <div className="profile__text">
          <p className="profile__text_name">{profileData.username}</p> 
          <p className="profile__text_nick">{profileData.email}</p>  
        </div>
      </div>
      <div className="profile__actions">
        <button className="profile__button">Follow</button>
        <button className="profile__button">Message</button>
      </div>
      <div className="profile__stats">
        <div className="profile__stat">1.2K<p className="profile__stat-text">Followers</p></div>
        <div className="profile__stat">2.3K<p className="profile__stat-text">Following</p></div>
        <div className="profile__stat">2.3K<p className="profile__stat-text">Friends</p></div>
      </div>
    </div>
  );
}

export default Profile;*/

import React from "react";
import avatar from "../images/avatar.jpg";

function Profile({ profileData }) {
  if (!profileData) {
    return <div>Загрузка...</div>;
  }

  return (
    <div className="profile">
      <div className="profile__info">
        <img
          className="profile__avatar"
          alt="avatar"
          src={profileData.avatar || avatar}
        />
        <div className="profile__text">
          <p className="profile__text_name">{profileData.username}</p>
          <p className="profile__text_nick">{profileData.email}</p>
        </div>
      </div>
      <div className="profile__actions">
        <button className="profile__button">Follow</button>
        <button className="profile__button">Message</button>
      </div>
      <div className="profile__stats">
        <div className="profile__stat">
          1.2K<p className="profile__stat-text">Followers</p>
        </div>
        <div className="profile__stat">
          2.3K<p className="profile__stat-text">Following</p>
        </div>
        <div className="profile__stat">
          2.3K<p className="profile__stat-text">Friends</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
