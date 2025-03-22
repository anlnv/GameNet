import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import Profile from "./Profile";
import ProfileSettings from "./ProfileSettings";
import Survey from "./Survey";
import Finder from "./Finder";
import Login from "./Login";
import Register from "./Register";
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
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Ошибка проверки авторизации:", err);
        localStorage.removeItem("token");
      }
    }
    setIsAuthChecked(true);
    setLoading(false);
  };

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
