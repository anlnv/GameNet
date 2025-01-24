// import { Link, useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import logo from "@/../public/favicon.svg";
import Image from "next/image";
import styles from "./Header.module.css";

export default function Header(props) {
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter(); // Для перенаправления
  let hideTimeout = null;

  const handleMouseEnter = () => {
    clearTimeout(hideTimeout);
    setShowSettings(true);
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => {
      setShowSettings(false);
    }, 2000);
  };

  const handleSearchClick = () => {
    router.push("/users"); // Перенаправляем на страницу поиска пользователей
  };

  return (
    <header className={styles.header}>
      <Image src={logo} alt="Header logo" width={18} height={18} />
      <p className={styles.header__name}>GameNet</p>
      <div className={styles.header__links}>
        <Link href="/home" className={styles.header__link}>Home</Link>
        <Link href="/feed" className={styles.header__link}>Feed</Link>
        <Link href="/communities" className={styles.header__link}>Communities</Link>
        <Link href="/finder" className={styles.header__link}>Finder</Link>
      </div>
      <nav className={styles.navbar}>
        <button
          className={`${styles["navbar__icon"]} ${styles["navbar__icon_search"]}`}
          onClick={handleSearchClick}
        ></button>
        <button
          className={`${styles["navbar__icon"]} ${styles["navbar__icon_notifications"]}`}
        ></button>
        <div
          className={`${styles["navbar__icon"]} ${styles["navbar__icon_settings"]}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {showSettings && (
            <div
              className={styles.settings_popup}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href="/profile-settings" className={styles.settings_popup__item}>Profile Settings</Link>
              <Link href="/survey" className={styles.settings_popup__item}>Recommendation Survey</Link>
              <button
                className={`${styles["settings_popup__item"]} ${styles["settings_popup__logout"]}`}
                onClick={props.onLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
