import { useState } from "react";
import { useRouter } from "next/navigation";
import { callAPI } from "@/utils/api";
import styles from "./Finder.module.css";

export default function Finder({ profileData }) {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const userId = profileData.id; // Идентификатор текущего пользователя

  const fetchRecommendedUsers = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
      if (!token) {
        if (router.pathname !== "/login") {
          router.push("/login");
        }
        setLoading(false);
        return;
      }

    try {
        const data = await callAPI(`/rs/${userId}/find`);
        setRecommendedUsers(data.mates); // Данные пользователей в mates
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLetsGoClick = () => {
    fetchRecommendedUsers();
    setShowRecommendations(true);
  };

  const handleAddFriend = (userName) => {
    alert(`${userName} added as a friend!`);
  };

  const handleProfileRedirect = (userId) => {
    router.push(`/user/${userId}`); // Перенаправление на страницу профиля
  };

  return (
    <div className={styles.finder}>
      <h1>Find your teammates</h1>
      {!showRecommendations ? (
        <button className={styles.lets_go_btn} onClick={handleLetsGoClick}>
          Let&apos;s go
        </button>
      ) : (
        <div className={styles.recommendations}>
          <h2>Recommended Users</h2>
          {loading && <p>Loading...</p>}
          {error && <p className={styles.error_message}>{error}</p>}
          <ul>
            {recommendedUsers.map((user, index) => (
              <li key={index} className={styles.user_item}>
                <div className={styles.user_info}>
                  <span
                    className={styles.username}
                    onClick={() => handleProfileRedirect(user.user_id)} // Обработчик клика на имя
                  >
                    {user.username}
                  </span>
                  <span className={styles.user_score}>{user.score}</span>{" "}
                  {/* Можно показывать очки */}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
