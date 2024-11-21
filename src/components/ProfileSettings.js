import { useState } from "react";
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
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Nickname:
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </label>
        <label>
          Avatar:
          <input type="file" onChange={handleImageChange} />
        </label>
        <div className="profile-settings__avatar-preview">
          <img src={avatar} alt="Avatar preview" />
        </div>
        <button onClick={handleSave}>Save Changes</button>
      </div>
    </div>
  );
}

export default ProfileSettings;