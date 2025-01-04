/*import { useState } from "react";
import "./ps.css";

function ProfileSettings({ profileData, updateProfile }) {
  const [name, setName] = useState(profileData.name);
  const [nickname, setNickname] = useState(profileData.nickname);
  const [avatar, setAvatar] = useState(profileData.avatar);

  const handleSave = () => {
    updateProfile({ name, nickname, avatar });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatar(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      <div className="profile-settings__form">
        <label className="profile-settings__label">
          Name:
          <input
            className="profile-settings__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label  className="profile-settings__label">
          Nickname:
          <input
            className="profile-settings__input"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <label className="profile-settings__label profile-settings__label_avatar">
          Avatar:
          <input type="file" onChange={handleImageChange} />
        </label>
        <div className="profile-settings__avatar-preview">
          <img src={avatar} alt="Avatar preview" />
        </div>
        <button className="profile-settings__save-button" onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default ProfileSettings;*/

import { useState } from "react";
import "./ps.css";

function ProfileSettings({ profileData, updateProfile }) {
  const [username, setUsername] = useState(profileData.username);
  const [email, setEmail] = useState(profileData.email);
  const [gender, setGender] = useState(profileData.gender);
  const [purpose, setPurpose] = useState(profileData.purpose);
  const [self_assessment_lvl, setSelfAssesmentLevel] = useState(profileData.self_assessment_lvl);
  const [preferred_communication, setPreferredCommunication] = useState(profileData.preferred_communication);
  const [hours_per_week, setHours] = useState(profileData.hours_per_week);
  const [new_avatar, setAvatar] = useState(profileData.new_avatar);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = { gender, purpose, self_assessment_lvl, preferred_communication, hours_per_week, new_avatar }; 

      const response = await fetch("http://87.242.103.34:5000/user/updatecreds", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update profile");
      }

      await updateProfile(payload);
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <div className="profile-settings__form">
        <label className="profile-settings__label">
          Username:
          <input
            className="profile-settings__input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          Email:
          <input
            className="profile-settings__input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          Gender:
          <input
            className="profile-settings__input"
            type="text"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          Purpose:
          <input
            className="profile-settings__input"
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          Self assesment level:
          <input
            className="profile-settings__input"
            type="text"
            value={self_assessment_lvl}
            onChange={(e) => setSelfAssesmentLevel(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          preferred_communication:
          <input
            className="profile-settings__input"
            type="text"
            value={preferred_communication}
            onChange={(e) => setPreferredCommunication(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          hours_per_week:
          <input
            className="profile-settings__input"
            type="text"
            value={hours_per_week}
            onChange={(e) => setHours(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          new_avatar:
          <input
            className="profile-settings__input"
            type="text"
            value={new_avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </label>
        <button
          className="profile-settings__save-button"
          onClick={handleSave}
          disabled={isSubmitting}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default ProfileSettings;
