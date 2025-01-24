import { useState } from "react";
import styles from "./Profile-settings.module.css";
import { callAPI } from "@/utils/api";

export default function ProfileSettings({ profileData, updateProfile }) {
  const [username, setUsername] = useState(profileData.username);
  const [dateOfBirth, setDateOfBirth] = useState(profileData.date_of_birth);
  const [gender, setGender] = useState(profileData.gender || "male");
  const [purpose, setPurpose] = useState(profileData.purpose || "");
  const [selfAssessment, setSelfAssessment] = useState(
    profileData.self_assessment_lvl || ""
  );
  const [preferredCommunication, setPreferredCommunication] = useState(
    profileData.preferred_communication || ""
  );
  const [hoursPerWeek, setHoursPerWeek] = useState(
    profileData.hours_per_week || 0
  );
  const [contacts, setContacts] = useState(
    profileData.contacts || {
      vk: "",
      telegram: "",
      steam: "",
      discord: "",
    }
  );
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
      const payload = {
        new_username: username !== profileData.username ? username : null,
        new_password: null,
        new_dob: dateOfBirth !== profileData.date_of_birth ? dateOfBirth : null,
      };
      // const body = JSON.stringify(payload);

      const response = await callAPI(`/user/change-credits`, {
        method: "PATCH",
        body: payload,
      });
      //   const response = await fetch("http://87.242.103.34:5000/user/change-credits", {
      //     method: "PATCH",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: JSON.stringify(payload),
      //   });

      //   if (!response.ok) {
      //     const errorData = await response.json();
      //     throw new Error(errorData.message || "Failed to update credits");
      //   }

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
      const updatedContacts = Object.fromEntries(
        Object.entries(contacts).map(([key, value]) => [
          key,
          value !== profileData.contacts?.[key] ? value : null,
        ])
      );

      const payload = { ...updatedContacts };
      // const body = JSON.stringify(payload);
      const response = await callAPI(`/user/update-me-contacts`, {
        method: "PATCH",
        body: payload,
      });
      // const response = await fetch("http://87.242.103.34:5000/user/update-me-contacts", {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to update contacts");
      // }

      // await updateProfile({ contacts });
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
      const payload = {
        purpose: purpose !== profileData.purpose ? purpose : null,
        self_assessment_lvl:
          selfAssessment !== profileData.self_assessment_lvl
            ? selfAssessment
            : null,
        preferred_communication:
          preferredCommunication !== profileData.preferred_communication
            ? preferredCommunication
            : null,
        hours_per_week:
          hoursPerWeek !== profileData.hours_per_week ? hoursPerWeek : null,
      };
      // console.log(payload);
      // const body = JSON.stringify(payload);

      const response = await callAPI(`/user/update-me`, {
        method: "PATCH",
        body: payload,
      });
      // const response = await fetch("http://87.242.103.34:5000/user/update-me", {
      //   method: "PATCH",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(payload),
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to update basic info");
      // }

      // await updateProfile(payload);
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
      const formData = new FormData();
      formData.append("new_avatar", newAvatar);

      const response = await callAPI(`/user/update-me-avatar`, {
        method: "PATCH",
        body: formData,
      });
      // const response = await fetch("http://87.242.103.34:5000/user/update-me-avatar", {
      //   method: "PATCH",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: formData,
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to update avatar");
      // }

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
      const response = await callAPI(`/auth/steam/login`);
      // const response = await fetch("http://87.242.103.34:5000/auth/steam/login", {
      //   method: "GET",
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // });

      // if (!response.ok) {
      //   const errorData = await response.json();
      //   throw new Error(errorData.message || "Failed to connect Steam");
      // }

      setSuccessMessage("Steam account connected successfully!");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.profile_settings}>
      <h2>Profile Settings</h2>
      {error && <p className={styles.error_message}>{error}</p>}
      {successMessage && (
        <p className={styles.success_message}>{successMessage}</p>
      )}

      <form
        className={styles.profile_settings__form}
        onSubmit={handleSaveCredits}
      >
        <label className={styles.profile_settings__label}>
          Username:
          <input
            className={styles.profile_settings__input}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label className={styles.profile_settings__label}>
          Date of Birth:
          <input
            className={styles.profile_settings__input}
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
          />
        </label>
        <button
          className={styles.profile_settings__save_button}
          type="submit"
          disabled={isSubmitting}
        >
          Save Credits
        </button>
      </form>

      <form
        className={styles.profile_settings__form}
        onSubmit={handleSaveBasicInfo}
      >
        <label className={styles.profile_settings__label}>
          Gender:
          <select
            className={styles.profile_settings__select}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </label>
        <label className={styles.profile_settings__label}>
          Purpose:
          <input
            className={styles.profile_settings__input}
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </label>
        <label className={styles.profile_settings__label}>
          Self-Assessment Level:
          <input
            className={styles.profile_settings__input}
            type="text"
            value={selfAssessment}
            onChange={(e) => setSelfAssessment(e.target.value)}
          />
        </label>
        <label className={styles.profile_settings__label}>
          Preferred Communication:
          <input
            className={styles.profile_settings__input}
            type="text"
            value={preferredCommunication}
            onChange={(e) => setPreferredCommunication(e.target.value)}
          />
        </label>
        <label className={styles.profile_settings__label}>
          Hours Per Week:
          <input
            className={styles.profile_settings__input}
            type="number"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
          />
        </label>
        <button
          className={styles.profile_settings__save_button}
          type="submit"
          disabled={isSubmitting}
        >
          Save Basic Info
        </button>
      </form>

      <form
        className={styles.profile_settings__form}
        onSubmit={handleSaveContacts}
      >
        <h3>Contacts</h3>
        <label className={styles.profile_settings__label}>
          VK:
          <input
            className={styles.profile_settings__input}
            value={contacts.vk}
            onChange={(e) => handleContactsChange(e, "vk")}
          />
        </label>
        <label className={styles.profile_settings__label}>
          Telegram:
          <input
            className={styles.profile_settings__input}
            value={contacts.telegram}
            onChange={(e) => handleContactsChange(e, "telegram")}
          />
        </label>
        <label className={styles.profile_settings__label}>
          Steam:
          <input
            className={styles.profile_settings__input}
            value={contacts.steam}
            onChange={(e) => handleContactsChange(e, "steam")}
          />
        </label>
        <label className={styles.profile_settings__label}>
          Discord:
          <input
            className={styles.profile_settings__input}
            value={contacts.discord}
            onChange={(e) => handleContactsChange(e, "discord")}
          />
        </label>
        <button
          className={styles.profile_settings__save_button}
          type="submit"
          disabled={isSubmitting}
        >
          Save Contacts
        </button>
      </form>

      <form
        className={styles.profile_settings__form}
        onSubmit={handleSaveAvatar}
      >
        <label className={styles.profile_settings__label}>
          New Avatar:
          <input
            className={styles.profile_settings__input}
            type="file"
            onChange={(e) => setNewAvatar(e.target.files[0])}
          />
        </label>
        <button
          className={styles.profile_settings__save_button}
          type="submit"
          disabled={isSubmitting}
        >
          Save Avatar
        </button>
      </form>

      <h3>Steam</h3>
      <div className={styles.profile_settings__integration}>
        <button
          className={`${styles.profile_settings__save_button} ${styles.steam}`}
          onClick={handleConnectSteam}
          disabled={isSubmitting}
        >
          Connect Steam
        </button>
      </div>
    </div>
  );
}
