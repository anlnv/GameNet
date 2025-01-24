import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { callAPI } from "@/utils/api";

export const useAuth = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        if (router.pathname !== "/login") {
          router.push("/login");
        }
        setLoading(false);
        return;
      }

      try {
        const data = await callAPI("/user/me");
        setProfileData(data);
      } catch (error) {
        switch (error.type) {
            case "NetworkError":
              console.error("Проблема с сетью:", error.message);
              alert("Проблема с подключением. Проверьте интернет.");
              break;
            case "ServerError":
              console.error("Ошибка на сервере:", error.details);
              alert(`Ошибка сервера: ${error.message}`);
              break;
            case "ParseError":
              console.error("Ошибка парсинга:", error.details);
              alert("Ошибка обработки ответа от сервера.");
              break;
            default:
              console.error("Неизвестная ошибка:", error);
              alert("Произошла непредвиденная ошибка.");
              break;
          }
          // Перенаправление на логин
          // if (router.pathname !== "/login") {
          //   router.push("/login");
          // }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);
  
  return { profileData, loading };
};
