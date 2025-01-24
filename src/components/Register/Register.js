import { useState } from "react";
import { useRouter } from 'next/router'
import styles from "@/styles/auth.module.css";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("${process.env.API_URL}/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      alert("Registration successful");
      
      router.push('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <h2 className={styles.authTitle}>Register</h2>
      {error && <p className={styles.authError}>{error}</p>}
      <form onSubmit={handleRegister} className={styles.authForm}>
        <div className={styles.authInputGroup}>
          <label className={styles.authLabel}>Username:</label>
          <input
            className={styles.authInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.authInputGroup}>
          <label className={styles.authLabel}>Email:</label>
          <input
            className={styles.authInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className={styles.authInputGroup}>
          <label className={styles.authLabel}>Confirm Password:</label>
          <input
            className={styles.authInput}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.authButton}>
          Register
        </button>
      </form>
      <p className={styles.authFooter}>
        Already have an account?{" "}
        <span className={styles.authLink} onClick={() => router.push("/login")}>
          Login here
        </span>
      </p>
    </div>
  );
}
