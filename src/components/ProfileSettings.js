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

/*import { useState } from "react";
import "./ps.css";

function ProfileSettings({ profileData, updateProfile }) {
  const [username, setUsername] = useState(profileData.username);
  const [email, setEmail] = useState(profileData.email);
  const [gender, setGender] = useState(profileData.gender);
  const [date_of_birth, setDate] = useState(profileData.date_of_birth);
  const [contacts, setContacts] = useState(profileData.contacts);
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
      const payload = { gender, contacts, new_avatar }; 

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
          Date of birth:
          <input
            className="profile-settings__input"
            type="text"
            value={date_of_birth}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
     
        <label className="profile-settings__label">
          Contacts:
          <input
            className="profile-settings__input"
            type="text"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          Avatar:
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

export default ProfileSettings;*/

import { useState } from "react";
import "./ps.css";

function ProfileSettings({ profileData, updateProfile }) {
  const [username, setUsername] = useState(profileData.username);
  const [email, setEmail] = useState(profileData.email);
  const [gender, setGender] = useState(profileData.gender || "male");
  const [date_of_birth, setDate] = useState(profileData.date_of_birth || "");
  const [contacts, setContacts] = useState(profileData.contacts || {
    vk: "",
    telegram: "",
    steam: "",
    discord: "",
  });
  const [new_avatar, setAvatar] = useState(profileData.new_avatar || "");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactsChange = (e, platform) => {
    setContacts({ ...contacts, [platform]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = { gender, date_of_birth, contacts, new_avatar };

      const response = await fetch("http://87.242.103.34:5000/user/updatecreds", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
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
        <p className="profile-settings_name">Username:</p>
          <input
            className="profile-settings__input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
        <p className="profile-settings_name">Email:</p>
          <input
            className="profile-settings__input"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
        <p className="profile-settings_name">Gender:</p>
          <select
            className="profile-settings__select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </label>
        <label className="profile-settings__label">
        <p className="profile-settings_name">Date of Birth:</p>
          <input
            className="profile-settings__input profile-settings__date-picker"
            type="date"
            value={date_of_birth}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <p className="profile-settings_name">Contacts:</p>
        <div className="profile-settings__contacts">
          <label className="profile-settings__label">
            VK:
            <input
              className="profile-settings__input profile-settings__input_contacts"
              type="url"
              value={contacts.vk}
              onChange={(e) => handleContactsChange(e, "vk")}
            />
          </label>
          <label className="profile-settings__label">
            Telegram:
            <input
              className="profile-settings__input"
              type="url"
              value={contacts.telegram}
              onChange={(e) => handleContactsChange(e, "telegram")}
            />
          </label>
          <label className="profile-settings__label">
            Steam:
            <input
              className="profile-settings__input"
              type="url"
              value={contacts.steam}
              onChange={(e) => handleContactsChange(e, "steam")}
            />
          </label>
          <label className="profile-settings__label">
            Discord:
            <input
              className="profile-settings__input"
              type="url"
              value={contacts.discord}
              onChange={(e) => handleContactsChange(e, "discord")}
            />
          </label>
        </div>
        <label className="profile-settings__label">
        <p className="profile-settings_name">Avatar:</p>
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
