/*import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./communityDetails.css";

function CommunityDetails() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState("");

  // Загрузка данных сообщества
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://87.242.103.34:5000/community/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch community details");
        }

        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommunityDetails();
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!community) {
    return <div>Loading...</div>;
  }

  const handleShowMembers = () => {
    alert(`Members: ${community.members.map((m) => m.username).join(", ")}`);
  };

  return (
    <div className="community-details">
      <h1>{community.name}</h1>
      <p>{community.description}</p>
      <button onClick={handleShowMembers}>
        Members ({community.members.length})
      </button>
      <h2>Posts</h2>
    </div>
  );
}

export default CommunityDetails;*/

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./communityDetails.css";

function CommunityDetails() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState("");
  const [showMembersPopup, setShowMembersPopup] = useState(false);

  // Загрузка данных сообщества
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://87.242.103.34:5000/community/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch community details");
        }

        const data = await response.json();
        setCommunity(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommunityDetails();
  }, [id]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!community) {
    return <div>Loading...</div>;
  }

  const toggleMembersPopup = () => {
    setShowMembersPopup(!showMembersPopup);
  };

  return (
    <div className="community-details">
      <h1 className="community-details__title">{community.name}</h1>
      <p className="community-details__description">{community.description}</p>
      <button className="community-details__members-button" onClick={toggleMembersPopup}>
        Members ({community.members.length})
      </button>

      {showMembersPopup && (
        <div className="popup-overlay" onClick={toggleMembersPopup}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup__close" onClick={toggleMembersPopup}>
              &times;
            </button>
            <h3 className="popup__title">Members</h3>
            <ul className="popup__members-list">
              {community.members.map((member) => (
                <li key={member.id} className="popup__member-item">
                  {member.username}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <h2 className="community-details__posts-title">Posts</h2>
      {community.posts && community.posts.length > 0 ? (
        <div className="community-details__posts">
          {community.posts.map((post) => (
            <div key={post.id} className="community-details__post">
              <h3 className="community-details__post-title">{post.title}</h3>
              <p className="community-details__post-content">{post.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="community-details__no-posts">No posts available.</p>
      )}
    </div>
  );
}

export default CommunityDetails;
