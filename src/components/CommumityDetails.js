import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./communityDetails.css";

function CommunityDetails({ profileData }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postAttachment, setPostAttachment] = useState(null);
  const [isMembersPopupOpen, setIsMembersPopupOpen] = useState(false);

  const userId = profileData.id;

  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await fetch(`http://87.242.103.34:5000/community/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch community details");
        }
        const data = await response.json();
        setCommunity(data);
        setIsOwner(data.creator_id === userId);

        const followingResponse = await fetch(
          `http://87.242.103.34:5000/user/${userId}/following`
        );
        const followingData = await followingResponse.json();
        const subscribedCommunities = followingData.communities.map(
          (comm) => comm.id
        );
        setIsSubscribed(subscribedCommunities.includes(parseInt(id)));
      } catch (error) {
        setError(error.message);
      }
    };

    fetchCommunityDetails();
  }, [id, userId]);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", "1");
    formData.append("content", postContent);
    formData.append("community_id", id);
    if (postAttachment) formData.append("attachments", postAttachment);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://87.242.103.34:5000/posts/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const newPost = await response.json();
      setCommunity((prev) => ({
        ...prev,
        posts: [newPost, ...prev.posts],
      }));
      setPostContent("");
      setPostAttachment(null);
    } catch (error) {
      setError(error.message);
    }
  };

  /*const handleSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isSubscribed ? "DELETE" : "POST";
      const response = await fetch(
        `http://87.242.103.34:5000/community/${id}/join`,
        {
          method,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update subscription status");
      }

      setIsSubscribed(!isSubscribed);
    } catch (error) {
      setError(error.message);
    }
  };*/

  const handleSubscription = async () => {
    const url = `http://87.242.103.34:5000/community/${id}/${isSubscribed ? "leave" : "join"}`;
    const method = isSubscribed ? "DELETE" : "POST";

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ community_id: id }),
      });

      if (!response.ok) {
        throw new Error(isSubscribed ? "Failed to unsubscribe" : "Failed to subscribe");
      }

      setIsSubscribed(!isSubscribed);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleMembersPopup = () => {
    setIsMembersPopupOpen(!isMembersPopupOpen);
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!community) {
    return <div>Loading...</div>;
  }

  return (
    <div className="community-details">
      <div className="community-details__header">
        <h1 className="community-details__title">{community.name}</h1>
        <button
          onClick={handleSubscription}
          className={`community-details__subscription-btn ${
            isSubscribed ? "subscribed" : "not-subscribed"
          }`}
        >
          {isSubscribed ? "Unsubscribe" : "Subscribe"}
        </button>
      </div>
      <p className="community-details__description">{community.description}</p>

      <button
        onClick={toggleMembersPopup}
        className="community-details__members-btn"
      >
        View Members
      </button>

      {isMembersPopupOpen && (
        <div className="community-details__members-popup">
          <div className="community-details__members-popup-content">
            <button
              className="community-details__members-popup-close"
              onClick={toggleMembersPopup}
            >
              X
            </button>
            <h3>Members</h3>
            {community.members && community.members.length > 0 ? (
              <div className="community-details__members-list">
                {community.members.map((member) => (
                  <div
                    key={member.id}
                    className="community-details__member"
                    onClick={() => navigate(`/user/${member.id}`)}
                  >
                    {member.username}
                  </div>
                ))}
              </div>
            ) : (
              <p className="community-details__no-members">No members yet.</p>
            )}
          </div>
        </div>
      )}

      {isOwner && (
        <form className="posts-form" onSubmit={handlePostSubmit}>
          <textarea
            placeholder="Write something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <div className="photo-form"></div>
          <input
            type="file"
            onChange={(e) => setPostAttachment(e.target.files[0])}
          />
          <button type="submit" >
            Post
          </button>
        </form>
      )}

      <h2 className="community-details__posts-title">Wall</h2>
      <div className="posts">
      {community.posts && community.posts.length > 0 ? (
        <div className="posts__item">
          {community.posts.map((post) => (
            <div key={post.id}>
              <p>{post.content}</p>
              {post.media_files && post.media_files.length > 0 && (
                <div style={{ display: "flex" }}>
                  {post.media_files.map((file, index) => (
                    <img
                      key={index}
                      src={file.file_url}
                      alt={`Post attachment ${index}`}
                      className="post-image"
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      
      ) : (
        <p className="community-details__no-posts">No posts available.</p>
      )}
    </div>
    </div>
  );
}

export default CommunityDetails;
