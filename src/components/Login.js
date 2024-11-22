/*import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css"; // Подключение файла со стилями

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState(""); // Заменили email на username
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://87.242.103.34:5000/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      // Вызов функции для установки авторизации
      onLoginSuccess(data.token);

      // Перенаправление на главную страницу
      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-input-group">
          <label className="auth-label">Username:</label>
          <input
            className="auth-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-group">
          <label className="auth-label">Password:</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const body = new URLSearchParams({ username, password }).toString();
      const response = await fetch("http://87.242.103.34:5000/auth/token", {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded' ,
        },
        body,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid credentials");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      onLoginSuccess(data.token);

      navigate("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Login</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleLogin} className="auth-form">
        <div className="auth-input-group">
          <label className="auth-label">Email:</label>
          <input
            className="auth-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-group">
          <label className="auth-label">Password:</label>
          <input
            className="auth-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">
          Login
        </button>
      </form>
      <p className="auth-footer">
        Don't have an account?{" "}
        <span className="auth-link" onClick={() => navigate("/register")}>
          Register here
        </span>
      </p>
    </div>
  );
}

export default Login;

