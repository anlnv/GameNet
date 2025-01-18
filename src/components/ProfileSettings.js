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
  const [dateOfBirth, setDateOfBirth] = useState(profileData.date_of_birth);
  const [gender, setGender] = useState(profileData.gender || "male");
  const [purpose, setPurpose] = useState(profileData.purpose || "");
  const [selfAssessment, setSelfAssessment] = useState(profileData.self_assessment_lvl || "");
  const [preferredCommunication, setPreferredCommunication] = useState(profileData.preferred_communication || "");
  const [hoursPerWeek, setHoursPerWeek] = useState(profileData.hours_per_week || 0);
  const [contacts, setContacts] = useState(profileData.contacts || {
    vk: "",
    telegram: "",
    steam: "",
    discord: "",
  });
  const [newAvatar, setNewAvatar] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactsChange = (e, platform) => {
    setContacts({ ...contacts, [platform]: e.target.value });
  };

  const handleSaveCredits = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        new_username: username !== profileData.username ? username : null,
        new_password: null,
        new_dob: dateOfBirth !== profileData.date_of_birth ? dateOfBirth : null,
      };

      const response = await fetch("http://87.242.103.34:5000/user/change-credits", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update credits");
      }

      await updateProfile(payload);
      setSuccessMessage("Credits updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveContacts = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const updatedContacts = Object.fromEntries(
        Object.entries(contacts).map(([key, value]) => [
          key,
          value !== profileData.contacts?.[key] ? value : null,
        ])
      );

      const payload = { ...updatedContacts };

      const response = await fetch("http://87.242.103.34:5000/user/update-me-contacts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update contacts");
      }

      await updateProfile({ contacts });
      setSuccessMessage("Contacts updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveBasicInfo = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const payload = {
        purpose: purpose !== profileData.purpose ? purpose : null,
        self_assessment_lvl: selfAssessment !== profileData.self_assessment_lvl ? selfAssessment : null,
        preferred_communication: preferredCommunication !== profileData.preferred_communication ? preferredCommunication : null,
        hours_per_week: hoursPerWeek !== profileData.hours_per_week ? hoursPerWeek : null,
      };

      const response = await fetch("http://87.242.103.34:5000/user/update-me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update basic info");
      }

      await updateProfile(payload);
      setSuccessMessage("Basic info updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAvatar = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("new_avatar", newAvatar);

      const response = await fetch("http://87.242.103.34:5000/user/update-me-avatar", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update avatar");
      }

      await updateProfile({ new_avatar: newAvatar });
      setSuccessMessage("Avatar updated successfully!");
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Обработчик для подключения Steam
  const handleConnectSteam = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://87.242.103.34:5000/auth/steam/login", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to connect Steam");
      }

      setSuccessMessage("Steam account connected successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      <form className="profile-settings__form" onSubmit={handleSaveCredits}>
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
          Date of Birth:
          <input
            className="profile-settings__input"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </label>
        <button className="profile-settings__save-button" type="submit" disabled={isSubmitting}>
          Save Credits
        </button>
      </form>

      <form className="profile-settings__form" onSubmit={handleSaveBasicInfo}>
        <label className="profile-settings__label">
          Gender:
          <select
            className="profile-settings__select"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
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
          Self-Assessment Level:
          <input
            className="profile-settings__input"
            type="text"
            value={selfAssessment}
            onChange={(e) => setSelfAssessment(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          Preferred Communication:
          <input
            className="profile-settings__input"
            type="text"
            value={preferredCommunication}
            onChange={(e) => setPreferredCommunication(e.target.value)}
          />
        </label>
        <label className="profile-settings__label">
          Hours Per Week:
          <input
            className="profile-settings__input"
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
          />
        </label>
        <button className="profile-settings__save-button" type="submit" disabled={isSubmitting}>
          Save Basic Info
        </button>
      </form>

      <form className="profile-settings__form" onSubmit={handleSaveContacts}>
        <h3>Contacts</h3>
        <label className="profile-settings__label">
          VK:
          <input
            className="profile-settings__input"
            value={contacts.vk}
            onChange={(e) => handleContactsChange(e, "vk")}
          />
        </label>
        <label className="profile-settings__label">
          Telegram:
          <input
            className="profile-settings__input"
            value={contacts.telegram}
            onChange={(e) => handleContactsChange(e, "telegram")}
          />
        </label>
        <label className="profile-settings__label">
          Steam:
          <input
            className="profile-settings__input"
            value={contacts.steam}
            onChange={(e) => handleContactsChange(e, "steam")}
          />
        </label>
        <label className="profile-settings__label">
          Discord:
          <input
            className="profile-settings__input"
            value={contacts.discord}
            onChange={(e) => handleContactsChange(e, "discord")}
          />
        </label>
        <button className="profile-settings__save-button" type="submit" disabled={isSubmitting}>
          Save Contacts
        </button>
      </form>

      <form className="profile-settings__form" onSubmit={handleSaveAvatar}>
        <label className="profile-settings__label">
          New Avatar:
          <input
            className="profile-settings__input"
            type="file"
            onChange={(e) => setNewAvatar(e.target.files[0])}
          />
        </label>
        <button className="profile-settings__save-button" type="submit" disabled={isSubmitting}>
          Save Avatar
        </button>
      </form>

      
      <h3>Steam</h3>
      <div className="profile-settings__integration">
        <button
          className="profile-settings__save-button steam"
          onClick={handleConnectSteam}
          disabled={isSubmitting}
        >
          Connect Steam
        </button>
        </div>
    </div>
  );
}

export default ProfileSettings;
