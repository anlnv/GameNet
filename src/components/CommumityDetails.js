import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./communityDetails.css";

function CommunityDetails({ profileData }) {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false); // Состояние для проверки владельца
  const [isSubscribed, setIsSubscribed] = useState(false); // Состояние для подписки
  const [postContent, setPostContent] = useState("");
  const [postAttachment, setPostAttachment] = useState(null);
  const [isMembersPopupOpen, setIsMembersPopupOpen] = useState(false); // Состояние для открытия попапа с участниками

  const userId = profileData.id;

  // Функция для получения данных о сообществе
  useEffect(() => {
    const fetchCommunityDetails = async () => {
      try {
        const response = await fetch(`http://87.242.103.34:5000/community/${id}`);

        if (!response.ok) {
          throw new Error("Failed to fetch community details");
        }

        const data = await response.json();
        setCommunity(data);

        // Проверяем, является ли текущий пользователь владельцем
        if (data.creator_id === userId) {
          setIsOwner(true); // Если ID совпадают, это владелец
        } else {
          setIsOwner(false); // Если не совпадает, не владелец
        }

        // Проверка на подписку
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
        posts: [...prev.posts, newPost],
      }));
      setPostContent("");
      setPostAttachment(null);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSubscription = async () => {
    try {
      const token = localStorage.getItem("token");
      const method = isSubscribed ? "DELETE" : "POST"; // Если подписка есть, удаляем, иначе подписываем
      const response = await fetch(
        `http://87.242.103.34:5000/community/${id}/subscription`,
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

      setIsSubscribed(!isSubscribed); // Переключаем статус подписки
    } catch (error) {
      setError(error.message);
    }
  };

  // Функция для открытия/закрытия попапа с участниками
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
      <h1 className="community-details__title">{community.name}</h1>
      <p className="community-details__description">{community.description}</p>

      {/* Кнопка подписки */}
      <button
        onClick={handleSubscription}
        className={`community-details__subscription-btn ${
          isSubscribed ? "subscribed" : "not-subscribed"
        }`}
      >
        {isSubscribed ? "Unsubscribe" : "Subscribe"}
      </button>

      {/* Кнопка для открытия попапа с участниками */}
      <button
        onClick={toggleMembersPopup}
        className="community-details__members-btn"
      >
        View Members
      </button>

      {/* Попап с участниками */}
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
                  <div key={member.id} className="community-details__member">
                    <p>{member.username}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="community-details__no-members">No members yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Если текущий пользователь является владельцем, показываем форму */}
      {isOwner && (
        <form className="community-details__post-form" onSubmit={handlePostSubmit}>
          <textarea
            className="community-details__post-input"
            placeholder="Write something..."
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
          />
          <input
            type="file"
            className="community-details__post-attachment"
            onChange={(e) => setPostAttachment(e.target.files[0])}
          />
          <button type="submit" className="community-details__post-submit">
            Post
          </button>
        </form>
      )}

      <h2 className="community-details__posts-title">Posts</h2>
      {community.posts && community.posts.length > 0 ? (
        <div className="community-details__posts">
          {community.posts.map((post) => (
            <div key={post.id} className="community-details__post">
              <p className="community-details__post-content">{post.content}</p>

              {/* Отображаем фото, если оно есть */}
              {post.media_files && post.media_files.length > 0 && (
                <div className="community-details__post-media">
                  {post.media_files.map((file, index) => (
                    <img
                      key={index}
                      src={file.file_url}
                      alt={`Post attachment ${index}`}
                      className="community-details__post-image"
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
  );
}

export default CommunityDetails;
