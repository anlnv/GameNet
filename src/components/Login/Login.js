import { useState } from "react";
import { useRouter } from 'next/router'
import { callAPI } from "@/utils/api";
import styles from "@/styles/auth.module.css";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  if (localStorage.getItem('token') && localStorage.getItem('token') != 'undefined') {
    router.push('/profile')
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await callAPI('/auth/token', {
        method: "POST",
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: { username, password },
      });
      localStorage.setItem("token", data.token);
      onLoginSuccess(data.token);
      router.push('/profile')
    } catch (err) {
      setError(err.message || "An error occurred during login.");
      console.error("Error during login:", err);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.authTitle}>Login</h2>
      {error && <p className={styles.authError}>{error}</p>}
      <form onSubmit={handleLogin} className={styles.authForm}>
        <div className={styles.authInputGroup}>
          <label className={styles.authLabel}>Email:</label>
          <input
            className={styles.authInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.authInputGroup}>
          <label className={styles.authLabel}>Password:</label>
          <input
            className={styles.authInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.authButton}>
          Login
        </button>
      </form>
      <p className={styles.authFooter}>
        Don&apos;t have an account?{" "}
        <span className={styles.authLink} onClick={() => router.push("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;
