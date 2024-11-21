import React, { useState } from "react";
import './finder.css';

function Finder() {
  const [showRecommendations, setShowRecommendations] = useState(false);

  const recommendedUsers = [
    { id: 1, name: "Alice", avatar: "https://distribution.faceit-cdn.net/images/352c264d-a045-43a6-9c38-9d92ee7d1812.jpeg" },
    { id: 2, name: "Bob", avatar: "https://steamuserimages-a.akamaihd.net/ugc/2187120707871691785/5628ECB681E124BEAF4128578486616C210AB39F/?imw=512&amp;imh=320&amp;ima=fit&amp;impolicy=Letterbox&amp;imcolor=%23000000&amp;letterbox=true" },
    { id: 3, name: "Charlie", avatar: "https://i.pinimg.com/736x/4b/13/1b/4b131b91279b98172ac2c15a92eafadd.jpg" },
    { id: 4, name: "Diana", avatar: "https://otvet.imgsmail.ru/download/304422029_76e61d25d17e0ec8b958b05283c93898_800.jpg" },
  ];

  const handleLetsGoClick = () => {
    setShowRecommendations(true);
  };

  const handleAddFriend = (userName) => {
    alert(`${userName} добавлен в друзья!`);
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
          <ul>
            {recommendedUsers.map((user) => (
              <li key={user.id} className="user-item">
                <div className="user-info">
                  <img src={user.avatar} alt={`${user.name}'s avatar`} />
                  <span>{user.name}</span>
                </div>
                <button
                  className="add-friend-btn"
                  onClick={() => handleAddFriend(user.name)}
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Finder;
