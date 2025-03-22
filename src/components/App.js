/*import React, { useState } from "react";
import Header from "./Header";
import Profile from "./Profile";
import Statistics from "./Statistics";
import UserWall from "./UserWall";
import Feed from "./Feed";
import ProfileSettings from "./ProfileSettings";
import Survey from "./Survey";
import Finder from "./Finder";

import { Route, Routes } from "react-router-dom";

function App() {
  const [profileData, setProfileData] = useState({
    name: "Anna",
    nickname: "@anlnv",
    avatar: "https://avatars.mds.yandex.net/i?id=4b6704f485b7c8f34ee8dc129db5d4e0_l-5910048-images-thumbs&n=13",
  });

  const updateProfile = (updatedData) => {
    setProfileData(updatedData);
  };

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route
          path="/home"
          element={
            <div>
              <Profile />
              <UserWall />
            </div>
          }
        />
        <Route
          path="/feed"
          element={
            <div>
              <Feed />
            </div>
          }
        />
        <Route
          path="/profile-settings"
          element={
            <div>
              <ProfileSettings
                profileData={profileData}
                updateProfile={updateProfile}
              />
            </div>
          }
        />
        <Route
          path="/survey"
          element={
            <div>
              <Survey
              />
            </div>
          }
        />
        <Route
          path="/finder"
          element={
            <div>
              <Finder
              />
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;*/

/*import React, { useState } from "react";
import Header from "./Header";
import Profile from "./Profile";
import Statistics from "./Statistics";
import UserWall from "./UserWall";
import Feed from "./Feed";
import ProfileSettings from "./ProfileSettings";
import Survey from "./Survey";
import Finder from "./Finder";
import Login from "./Login";
import Register from "./Register";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

function App() {
  const [profileData, setProfileData] = useState({
    username: "Anna",
    email: "anna@example.com",
    avatar:
      "https://avatars.mds.yandex.net/i?id=4b6704f485b7c8f34ee8dc129db5d4e0_l-5910048-images-thumbs&n=13",
  });

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token") // Проверяем наличие токена при загрузке
  );

  const updateProfile = (updatedData) => {
    setProfileData(updatedData);
  };

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token); // Сохраняем токен в локальное хранилище
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Удаляем токен при выходе
    setIsLoggedIn(false);
  };

  return (
    <div className="page">
      {isLoggedIn && <Header onLogout={handleLogout} />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              path="/home"
              element={
                <div>
                  <Profile profileData={profileData} />
                  <UserWall />
                </div>
              }
            />
            <Route
              path="/feed"
              element={
                <div>
                  <Feed />
                </div>
              }
            />
            <Route
              path="/profile-settings"
              element={
                <div>
                  <ProfileSettings
                    profileData={profileData}
                    updateProfile={updateProfile}
                  />
                </div>
              }
            />
            <Route
              path="/survey"
              element={
                <div>
                  <Survey />
                </div>
              }
            />
            <Route
              path="/finder"
              element={
                <div>
                  <Finder />
                </div>
              }
            />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;*/


/*import React, { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Header from "./Header";
import Profile from "./Profile";
import Statistics from "./Statistics";
import UserWall from "./UserWall";
import Feed from "./Feed";
import ProfileSettings from "./ProfileSettings";
import Survey from "./Survey";
import Finder from "./Finder";

function App() {
  const [profileData, setProfileData] = useState(null); // Данные профиля
  const [loading, setLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибок

  // Функция для загрузки данных профиля
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://87.242.103.34:5000/user/me", {
        method: "GET",
        headers: {
          "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZSIsImV4cCI6MTczNDg5MjQ4M30.eLGN_IxFR_XeeeDmPDcAPe5HsrNq8XBUSg3jIeu67-8', // Токен авторизации
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data");
      }

      const data = await response.json();
      setProfileData(data); // Обновляем состояние профиля
    } catch (err) {
      setError(err.message); // Обрабатываем ошибку
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных профиля при монтировании компонента
  useEffect(() => {
    fetchProfile();
  }, []);

  // Функция для обновления профиля и получения актуальных данных
  const updateProfile = async (updatedData) => {
    try {
      const response = await fetch("http://87.242.103.34:5000/user/updatecreds", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbmRyZSIsImV4cCI6MTczNDg5MjQ4M30.eLGN_IxFR_XeeeDmPDcAPe5HsrNq8XBUSg3jIeu67-8', // Токен авторизации
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // После успешного обновления данных, подтягиваем актуальные данные с сервера
      await fetchProfile();
    } catch (err) {
      setError(err.message); // Обрабатываем ошибку
    }
  };

  if (loading) return <div>Loading...</div>; // Показываем индикатор загрузки
  if (error) return <div>Error: {error}</div>; // Показываем ошибку

  return (
    <div className="page">
      <Header />
      <Routes>
        <Route
          path="/home"
          element={
            <div>
              <Profile profileData={profileData} />
              <UserWall />
            </div>
          }
        />
        <Route
          path="/feed"
          element={<Feed />}
        />
        <Route
          path="/profile-settings"
          element={
            <ProfileSettings
              profileData={profileData}
              updateProfile={updateProfile}
            />
          }
        />
        <Route
          path="/survey"
          element={<Survey />}
        />
        <Route
          path="/finder"
          element={<Finder />}
        />
      </Routes>
    </div>
  );
}

export default App;*/

/*
import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import Profile from "./Profile";
import Statistics from "./Statistics";
import UserWall from "./UserWall";
import Feed from "./Feed";
import ProfileSettings from "./ProfileSettings";
import Survey from "./Survey";
import Finder from "./Finder";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const navigate = useNavigate(); 

  // Функция для загрузки данных профиля
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("http://87.242.103.34:5000/user/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch profile data, status: " + response.status);
      }

      const data = await response.json();
      setProfileData(data); 
    } catch (err) {
      setError(err.message); 
    } finally {
      setLoading(false);
    }
  };

  // Функция для обновления профиля
  const updateProfile = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token found. Please log in.");
      }

      const response = await fetch("http://87.242.103.34:5000/user/updatecreds", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // После успешного обновления, подтягиваем актуальные данные с сервера
      await fetchProfile();
    } catch (err) {
      setError(err.message); 
    }
  };

  // Функция обработки успешного входа
  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    fetchProfile();
    navigate("/home"); 
  };

  // Функция обработки выхода
  const handleLogout = () => {
    localStorage.removeItem("token"); 
    setIsLoggedIn(false);
    navigate("/login"); 
  };

  // Загрузка данных профиля, если пользователь залогинен
  useEffect(() => {
    if (isLoggedIn) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page">
      {isLoggedIn && <Header onLogout={handleLogout} />}
      <Routes>
        {!isLoggedIn ? (
          <>
            <Route
              path="/login"
              element={<Login onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              path="/home"
              element={
                <div>
                  <Profile profileData={profileData} />
                  <UserWall />
                </div>
              }
            />
            <Route path="/feed" element={<Feed />} />
            <Route
              path="/profile-settings"
              element={
                <ProfileSettings
                  profileData={profileData}
                  updateProfile={updateProfile}
                />
              }
            />
            <Route path="/survey" element={<Survey />} />
            <Route path="/finder" element={<Finder />} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;*/

import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Profile from "./Profile";
import UserWall from "./UserWall";
import Feed from "./Feed";
import ProfileSettings from "./ProfileSettings";
import Survey from "./Survey";
import Finder from "./Finder";
import Login from "./Login";
import Register from "./Register";
import Communities from "./Communities";
import CommunityDetails from "./CommumityDetails";
import User from "./User";
import Users from "./Users";

function App() {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Функция проверки токена при загрузке приложения
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    
    if (token) {
      try {
        const response = await fetch( `${API_BASE_URL}/user/me`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
          setIsLoggedIn(true);
        } else {
          localStorage.removeItem("token"); // Невалидный токен
        }
      } catch (err) {
        console.error("Ошибка проверки авторизации:", err);
        localStorage.removeItem("token");
      }
    }
    setIsAuthChecked(true);
    setLoading(false);
  };

  // Выполняем проверку токена при загрузке приложения
  useEffect(() => {
    checkAuth();
  }, []);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    checkAuth();
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfileData(null);
    navigate("/login");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="page">
      {isLoggedIn && <Header onLogout={handleLogout} />}
      <Routes>
        {!isLoggedIn ? (
          <>
            {isAuthChecked && (
              <>
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </>
        ) : (
          <>
            <Route
              path="/home"
              element={
                <div>
                  <Profile profileData={profileData} />
                </div>
              }
            />
            <Route
              path="/profile-settings"
              element={
                <ProfileSettings
                  profileData={profileData}
                  updateProfile={checkAuth}
                />
              }
            />
            <Route path="/survey" element={<Survey />} />
            <Route path="/finder" element={<Finder profileData={profileData} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/user/:userId" element={<User currentUser={profileData}/>} />
            <Route path="*" element={<Navigate to="/home" />} />
          </>
        )}
      </Routes>
    </div>
  );
}

export default App;
