import React, { useState } from "react";
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
              <Profile profileData={profileData} />
              <Statistics />
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

export default App;
