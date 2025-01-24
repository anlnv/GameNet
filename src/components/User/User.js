import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { callAPI } from "@/utils/api";
import CloseButtonIcon from "@/../public/images/close-button.svg";
import styles from '@/components/Profile/Profile.module.css'
import styles2 from '@/components/Users/Users.module.css' 

export default function User({ currentUser }) {
  const router = useRouter();
  const { userId } = router.query; // Получение параметров маршрута
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
  }, [userData, currentUser, router]);

  const fetchUserPosts = async () => {
    if (userId) {
      try {
        const result = await callAPI(`/posts/${userId}/get-posts`);
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
        const data = await callAPI(`/user/${userId}`);

        if (data && data.id) {
          // Проверяем, что данные пользователя корректны
          setUserData(data);

          const avatarData = await callAPI(
            `/user/${userId}/get-avatar?user_id=${userId}`
          );
          setAvatarUrl(
            avatarData.avatar_url !== "no avatar" ? avatarData.avatar_url : null
          );

          const followersData = await callAPI(`/user/${userId}/followers`);
          setFollowersCount(followersData.users?.length || 0);
          setFollowersList(followersData.users || []);

          const followingData = await callAPI(`/user/${userId}/following`);

          setFollowingCount(followingData.users?.length || 0);
          setCommunityCount(followingData.communities?.length || 0);
          setFollowingList(followingData.users || []);
          setCommunityList(followingData.communities || []);

          const followingDataCheck = await callAPI(
            `/user/${currentUser?.id}/following`
          );
          const isFollowed = followingDataCheck.users.some(
            (user) => user.id === parseInt(userId, 10)
          );
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
      fetchUserPosts();
    }
  }, [userId, currentUser]);

  const handleFollow = async () => {
    try {
      const response = await callAPI(`/user/${userId}/follow`, {
        method: "POST",
      });
      // const response = await fetch(
      //   `http://87.242.103.34:5000/user/${userId}/follow`,
      //   {
      //     method: "POST",
      //     headers: {
      //       "Authorization": `Bearer ${localStorage.getItem("token")}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      const updatedFollowersData = await callAPI(`/user/${userId}/followers`);
      setFollowersCount(updatedFollowersData.users?.length || 0);
      setFollowersList(updatedFollowersData.users || []);
      setIsFollowing(true);
      // if (response.ok) {
      //   // Обновляем состояние подписчиков
      //   const updatedFollowersResponse = await fetch(
      //     `http://87.242.103.34:5000/user/${userId}/followers`
      //   );
      //   const updatedFollowersData = await updatedFollowersResponse.json();
      //   setFollowersCount(updatedFollowersData.users?.length || 0);
      //   setFollowersList(updatedFollowersData.users || []);
      //   setIsFollowing(true);
      // }
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const handleUnfollow = async () => {
    try {
      const response = await callAPI(`/user/${userId}/unfollow`, {
        method: 'DELETE'
      });
      // const response = await fetch(
      //   `http://87.242.103.34:5000/user/${userId}/unfollow`,
      //   {
      //     method: "DELETE",
      //     headers: {
      //       "Authorization": `Bearer ${localStorage.getItem("token")}`,
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      const updatedFollowersData = await callAPI(`/user/${userId}/followers`);
      setFollowersCount(updatedFollowersData.users?.length || 0);
      setFollowersList(updatedFollowersData.users || []);
      setIsFollowing(false);

      // if (response.ok) {
      //   // Обновляем состояние подписчиков
      //   const updatedFollowersResponse = await fetch(
      //     `http://87.242.103.34:5000/user/${userId}/followers`
      //   );
      //   const updatedFollowersData = await updatedFollowersResponse.json();
      //   setFollowersCount(updatedFollowersData.users?.length || 0);
      //   setFollowersList(updatedFollowersData.users || []);
      //   setIsFollowing(false);
      // }
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
    router.push(path);
    closeModal(); // Закрываем модальное окно при переходе на пользователя/комьюнити
  };

  if (loading) return <div>Loading...</div>;
  if (!userData) return <div>User not found</div>;

  return (
    <div className={styles.profile}>
      <div className={styles.profile__info}>
        <div
          className={styles.profile__avatar}
          style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none" }}
        >
          {!avatarUrl && (
            <span className={styles.profile__avatar_text}>No avatar</span>
          )}
        </div>
        <div className={styles.profile__text}>
          <p className={styles.profile__text_name}>{userData.username}</p>
          <p className={styles.profile__text_nick}>
            Steam ID: {userData.contacts?.steam || "Not specified"}
          </p>
        </div>
      </div>

      <div className={styles.profile__actions}>
        {userData.id !== currentUser.id && // Проверяем, что это не текущий пользователь
          (isFollowing ? (
            <button className={styles.profile__button} onClick={handleUnfollow}>
              Unfollow
            </button>
          ) : (
            <button
              className={styles.profile__button}
              onClick={handleFollow}
              style={{ backgroundColor: "rgb(89, 120, 199)" }}
            >
              Follow
            </button>
          ))}
      </div>

      <div className={styles.profile__stats}>
        <div className={styles.profile__stat} onClick={() => openModal("followers")}>
          {followersCount} <p className={styles.profile__stat_text}>Followers</p>
        </div>
        <div className={styles.profile__stat} onClick={() => openModal("following")}>
          {followingCount} <p className={styles.profile__stat_text}>Following</p>
        </div>
        <div className={styles.profile__stat} onClick={() => openModal("communities")}>
          {communityCount} <p className={styles.profile__stat_text}>Communities</p>
        </div>
      </div>

      <h2>User Information</h2>
      <div className={styles.profile__details}>
        <div className={styles.profile__details_grid}>
          <p className={styles.profile__detail}>
            <strong>Gender:</strong> {userData.gender || "Not specified"}
          </p>
          <p className={styles.profile__detail}>
            <strong>Purpose:</strong> {userData.purpose || "Not specified"}
          </p>
          <p className={styles.profile__detail}>
            <strong>Preferred Communication:</strong>{" "}
            {userData.preferred_communication || "Not specified"}
          </p>
          <p className={styles.profile__detail}>
            <strong>Hours Per Week:</strong> {userData.hours_per_week || "0"}
          </p>
        </div>
      </div>

      <div className={styles2.userwall}>
        <h2>User Wall</h2>

        <div className={styles2.posts}>
          {userPosts
            .slice() // Создаём копию массива
            .reverse() // Отображаем в обратном порядке
            .map((post) => (
              <div key={post.id} className={styles2.posts__item}>
                <p>{post.content}</p>
                {post.media_files && post.media_files.length > 0 && (
                  <img src={post.media_files[0].file_url} alt="Post" />
                )}
                <span className={styles2.post_date}>
                  {new Date(post.created_at).toLocaleString()}
                </span>
              </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modal__close} onClick={closeModal}>
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
