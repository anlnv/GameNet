import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [timezone, setTimezone] = useState("");
  const [timezones, setTimezones] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchTimezones() {
      try {
        const response = await fetch(`${API_BASE_URL}/user/timezones`);
        const data = await response.json();
        setTimezones(data.timezones || []);
        console.log(data.timezones)
      } catch (error) {
        console.error("Failed to load timezones", error);
      }
    }
    fetchTimezones();
  }, []);

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
      const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, dob, gender, timezone }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }

      alert("Registration successful");
      navigate("/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-title">Register</h2>
      {error && <p className="auth-error">{error}</p>}
      <form onSubmit={handleRegister} className="auth-form">
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
          <label className="auth-label">Email:</label>
          <input
            className="auth-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className="auth-input-group">
          <label className="auth-label">Confirm Password:</label>
          <input
            className="auth-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-group">
          <label className="auth-label">Date of Birth:</label>
          <input
            className="auth-input"
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            required
          />
        </div>
        <div className="auth-input-group">
          <label className="auth-label">Gender:</label>
          <select
            className="auth-input"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="auth-input-group">
          <label className="auth-label">Timezone:</label>
          <select
            className="auth-input"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
          >
            <option value="">Select Timezone</option>
            {timezones.map((tz, index) => (
              <option key={index} value={tz}>{tz}</option>
            ))}
          </select>
        </div>
        <button type="submit" className="auth-button">Register</button>
      </form>
      <p className="auth-footer">
        Already have an account? <span className="auth-link" onClick={() => navigate("/login")}>Login here</span>
      </p>
    </div>
  );
}

export default Register;

