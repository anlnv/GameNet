import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { callAPI } from "@/utils/api";
import CloseButtonIcon from "../../../public/images/close-button.svg";
import Image from "next/image";
import AvatarImg from '../../../public/images/avatar.jpg'
import LoadingPage from '../Loading/Loading';
import styles from './Profile.module.css'

export default function Profile({ profileData }) {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loadingAvatar, setLoadingAvatar] = useState(true);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [communityCount, setCommunityCount] = useState(0);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [communityList, setCommunityList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(""); // 'followers', 'following', or 'communities'

  const router = useRouter();

  // Fetch avatar
useEffect(() => {
  const fetchAvatar = async () => {
    if (profileData && profileData.id) {
      try {
        const data = await callAPI(`/user/${profileData.id}/get-avatar?user_id=${profileData.id}`)
        setAvatarUrl(data.avatar_url !== "no avatar" ? data.avatar_url : null);
      } catch (error) {
        console.error("Error fetching avatar:", error);
        setAvatarUrl(null);
      }
    }
    setLoadingAvatar(false);
  };
  fetchAvatar();
  }, [profileData]);


  // Fetch followers, following, and communities
  useEffect(() => {
    const fetchFollowData = async () => {
      if (profileData && profileData.id) {
        try {
          const followersData = await callAPI(`/user/${profileData.id}/followers`);
          const followingData = await callAPI(`/user/${profileData.id}/following`);

          setFollowersCount(followersData.users?.length || 0);
          setFollowersList(followersData.users || []);

          setFollowingCount(followingData.users?.length || 0);
          setCommunityCount(followingData.communities?.length || 0);

          setFollowingList(followingData.users || []);
          setCommunityList(followingData.communities || []);
        } catch (error) {
          console.error("Error fetching follow data:", error);
        }
      }
    };
    fetchFollowData();
  }, [profileData]);


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
  };

  if (!profileData) {
    return <LoadingPage/>
  }

  return (
    <div className={styles.profile}>
      <div className={styles.profile__info}>
        {loadingAvatar ? (
          <div className="profile__avatar_loading">Loading...</div>
        ) : (
          <div
            className={styles.profile__avatar}
            style={{ backgroundImage: avatarUrl ? `url(${avatarUrl})` : "none" }}
          >
            {!avatarUrl && <Image src={AvatarImg} alt='Avatar placeholder' width={256} height={256} />}
          </div>
        )}
        <div className={styles.profile__text}>
          <p className={styles.profile__text_name}>{profileData.username}</p>
          <p className={styles.profile__text_nick}>{profileData.email}</p>
        </div>
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
            <strong>Self assessment level:</strong> {profileData.info.self_assessment_lvl || "Not specified"}
          </p>
          <p className={styles.profile__detail}>
            <strong>Purpose:</strong> {profileData.info.purpose || "Not specified"}
          </p>
          <p className={styles.profile__detail}>
            <strong>Preferred Communication:</strong>{" "}
            {profileData.info.preferred_communication || "Not specified"}
          </p>
          <p className={styles.profile__detail}>
            <strong>Hours Per Week:</strong> {profileData.info.hours_per_week || "0"}
          </p>
        </div>
      </div>
      {isModalOpen && (
        <div className={styles.modal} onClick={closeModal}>
          <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modal__close} onClick={closeModal}>
              <Image src={CloseButtonIcon} alt="Close button" width={18} height={18} style={{ width: '18px', height: '18px' }}/>
            </button>
            <h2>
              {modalType === "followers"
                ? "Followers"
                : modalType === "following"
                ? "Following"
                : "Communities"}
            </h2>
            <ul className={styles.profile__u_list}>
              {modalType === "followers" &&
                followersList.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleNameClick("user", user.id)}
                    className={`${styles.profile__list} clickable`}
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "following" &&
                followingList.map((user) => (
                  <li
                    key={user.id}
                    onClick={() => handleNameClick("user", user.id)}
                    className={`${styles.profile__list} clickable`}
                  >
                    {user.username}
                  </li>
                ))}
              {modalType === "communities" &&
                communityList.map((community) => (
                  <li
                    key={community.id}
                    onClick={() => handleNameClick("community", community.id)}
                    className={`${styles.profile__list} clickable`}
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
