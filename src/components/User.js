import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./info.css";
import CloseButtonIcon from "../images/close-button.svg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function User({ currentUser }) {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'followers', 'following', or 'communities'
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    if (userData && userData.id === currentUser.id) {
      // Если ID пользователя не совпадает с текущим, перенаправляем на главную страницу
      navigate("/home");
    }
  }, [userData, currentUser, navigate]);

  const fetchUserPosts = async () => {
    if (userId) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/posts/${userId}/get-posts`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }
        const result = await response.json();
        setUserPosts(Array.isArray(result.posts) ? result.posts : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setUserPosts([]);
      }
    }
  };
  
// Fetch user data and related information
useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/user/${userId}`);
        const data = await response.json();
  
        if (data && data.id) {
          // Проверяем, что данные пользователя корректны
          setUserData(data);
  
          // Fetch avatar using new endpoint
          const avatarResponse = await fetch(
            `${API_BASE_URL}/user/${userId}/get-avatar?user_id=${userId}`
          );
          const avatarData = await avatarResponse.json();
          setAvatarUrl(avatarData.avatar_url !== "no avatar" ? avatarData.avatar_url : null);
  
          // Fetch followers, following, and communities
          const followersResponse = await fetch(
            `${API_BASE_URL}/user/${userId}/followers`
          );
          const followersData = await followersResponse.json();
          setFollowersCount(followersData.users?.length || 0);
          setFollowersList(followersData.users || []);
  
          const followingResponse = await fetch(
            `${API_BASE_URL}/user/${userId}/following`
          );
          const followingData = await followingResponse.json();
          setFollowingCount(followingData.users?.length || 0);
          setCommunityCount(followingData.communities?.length || 0);
          setFollowingList(followingData.users || []);
          setCommunityList(followingData.communities || []);
  
          // Check if following
          const isFollowedResponse = await fetch(
            `${API_BASE_URL}/user/${currentUser?.id}/following`
          );
          const followingDataCheck = await isFollowedResponse.json();
          const isFollowed = followingDataCheck.users.some((user) => user.id === parseInt(userId, 10));
          setIsFollowing(isFollowed);
        } else {
          console.error("User data not found or incorrect structure", data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      fetchUserData();
      fetchUserPosts()
    }
  }, [userId, currentUser]);
  

  const handleFollow = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/follow`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        // Обновляем состояние подписчиков
        const updatedFollowersResponse = await fetch(
          `${API_BASE_URL}/user/${userId}/followers`
        );
        const updatedFollowersData = await updatedFollowersResponse.json();
        setFollowersCount(updatedFollowersData.users?.length || 0);
        setFollowersList(updatedFollowersData.users || []);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };
  
  const handleUnfollow = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/user/${userId}/unfollow`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        // Обновляем состояние подписчиков
        const updatedFollowersResponse = await fetch(
          `${API_BASE_URL}/user/${userId}/followers`
        );
        const updatedFollowersData = await updatedFollowersResponse.json();
        setFollowersCount(updatedFollowersData.users?.length || 0);
        setFollowersList(updatedFollowersData.users || []);
        setIsFollowing(false);
      }
    } catch (error) {
      console.error("Error unfollowing user:", error);
    }
  };
  

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
    closeModal(); // Закрываем модальное окно при переходе на пользователя/комьюнити
  };

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className="profile">
      <div className="profile__info">
        <div
          className="profile__avatar"
          style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none" }}
        >
          {!avatarUrl && <span className="profile__avatar_text">No avatar</span>}
        </div>
        <div className="profile__text">
          <p className="profile__text_name">{userData.username}</p>
          <p className="profile__text_nick">Steam ID: {userData.contacts.steam || "Not specified"}</p>
        </div>
      </div>

      <div className="profile__actions">
  {userData.id !== currentUser.id && ( // Проверяем, что это не текущий пользователь
    isFollowing ? (
      <button className="profile__button" onClick={handleUnfollow}>
        Unfollow
      </button>
    ) : (
      <button className="profile__button" onClick={handleFollow} style={{ backgroundColor: "rgb(89, 120, 199)" }}>
        Follow
      </button>
    )
  )}
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
            <strong>Gender:</strong> {userData.gender || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Purpose:</strong> {userData.purpose || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Preferred Communication:</strong>{" "}
            {userData.preferred_communication || "Not specified"}
          </p>
          <p className="profile__detail">
            <strong>Hours Per Week:</strong> {userData.hours_per_week || "0"}
          </p>
        </div>
      </div>

      <div className="userwall">
      <h2>User Wall</h2>

      <div className="posts">
        {userPosts
          .slice() // Создаём копию массива
          .reverse() // Отображаем в обратном порядке
          .map((post) => (
            <div key={post.id} className="posts__item">
              <p>{post.content}</p>
              {post.media_files && post.media_files.length > 0 && (
                <img src={post.media_files[0].file_url} alt="Post" />
              )}
              <span className="post-date">
                {new Date(post.created_at).toLocaleString()}
              </span>
            </div>
          ))}
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
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal close on click
                      handleNameClick("user", user.id);
                    }}
                    className="clickable"
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "following" &&
                followingList.map((user) => (
                  <li
                    key={user.id}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal close on click
                      handleNameClick("user", user.id);
                    }}
                    className="clickable"
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "communities" &&
                communityList.map((community) => (
                  <li
                    key={community.id}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent modal close on click
                      handleNameClick("community", community.id);
                    }}
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

export default User;
