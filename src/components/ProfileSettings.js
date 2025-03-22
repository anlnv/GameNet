import React, { useState } from 'react';
import './ps.css';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const ProfileSettings = ({ profileData, updateProfile }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    personal: {
      username: profileData?.username || '',
      birthDate: profileData?.dob || '',
      bio: profileData?.description || ''
    },
    contacts: {
      telegram: profileData?.contacts?.telegram || '',
      discord: profileData?.contacts?.discord || '',
      steam: profileData?.contacts?.steam || ''
    },
    password: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoadingCredits, setIsLoadingCredits] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setErrors({});
    setSuccessMessage('');
  };

  const handleChange = (tab, field, value) => {
    setFormData(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [field]: value
      }
    }));
  };

  const handleSavePersonal = async () => {
    setIsLoadingCredits(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const payload = {
        new_username: 
          formData.personal.username !== profileData.username 
            ? formData.personal.username 
            : null,
        new_dob: 
          formData.personal.birthDate !== profileData.dob 
            ? formData.personal.birthDate 
            : null,
        new_bio: 
          formData.personal.bio !== profileData.description 
            ? formData.personal.bio 
            : null
      };

      if (Object.values(payload).every(v => v === null)) {
        throw new Error("No changes detected");
      }

      const response = await fetch(
        `${API_BASE_URL}/user/credits`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update personal info');
      }

      const updatedData = {
        username: payload.new_username || profileData.username,
        dob: payload.new_dob || profileData.dob,
        bio: payload.new_bio || profileData.description
      };

      await updateProfile({ ...profileData, ...updatedData });
      setSuccessMessage('Personal info updated successfully!');
    } catch (error) {
      setErrors({ common: error.message });
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const handleUpdateAvatar = async () => {
    setIsLoadingAvatar(true);
    setErrors({});

    if (!avatarFile) {
      throw new Error("Avatar file is required");
    }

    try {
      const token = localStorage.getItem('token');
      const formDataAvatar = new FormData();
      formDataAvatar.append('new_avatar', avatarFile);

      const response = await fetch(
        `${API_BASE_URL}/user/avatar`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataAvatar
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Avatar update failed');
      }

      const data = await response.json();
      await updateProfile({ avatar: data.avatar_url });
      setSuccessMessage('Avatar updated successfully!');
      setAvatarFile(null);
    } catch (error) {
      setErrors({ common: error.message });
    } finally {
      setIsLoadingAvatar(false);
    }
  };

  const handleSaveContacts = async () => {
    setIsLoadingCredits(true);
    setErrors({});

    try {
      const token = localStorage.getItem('token');
      const payload = {
        telegram: 
          formData.contacts.telegram !== profileData.contacts?.telegram 
            ? formData.contacts.telegram 
            : null,
        discord: 
          formData.contacts.discord !== profileData.contacts?.discord 
            ? formData.contacts.discord 
            : null,
        steam: 
          formData.contacts.steam !== profileData.contacts?.steam 
            ? formData.contacts.steam 
            : null
      };

      if (Object.values(payload).every(v => v === null)) {
        throw new Error("No changes detected");
      }

      const response = await fetch(
        `${API_BASE_URL}/user/contacts`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update contacts');
      }

      const updatedContacts = {};
      Object.entries(payload).forEach(([key, value]) => {
        if (value !== null) {
          updatedContacts[key] = value;
        }
      });

      await updateProfile({ contacts: updatedContacts });
      setSuccessMessage('Contacts updated successfully!');
    } catch (error) {
      setErrors({ common: error.message });
    } finally {
      setIsLoadingCredits(false);
    }
  };

  const handlePasswordSubmit = async () => {
    setIsLoadingCredits(true);
    setErrors({});

    const { newPassword, confirmPassword } = formData.password;
    if (newPassword !== confirmPassword) {
      setErrors({ password: 'Passwords do not match' });
      setIsLoadingCredits(false);
      return;
    }

    if (!newPassword) {
      throw new Error("New password is required");
    }

    try {
      const token = localStorage.getItem('token');
      const payload = {
        current_password: formData.password.currentPassword,
        new_password: newPassword
      };

      const response = await fetch(
        `${API_BASE_URL}/user/change-password`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password change failed');
      }

      setSuccessMessage('Password changed successfully!');
      setFormData(prev => ({
        ...prev,
        password: { currentPassword: '', newPassword: '', confirmPassword: '' }
      }));
    } catch (error) {
      setErrors({ common: error.message });
    } finally {
      setIsLoadingCredits(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-tabs">
        <div 
          className={`tab ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => handleTabChange('personal')}
        >
          Personal Information
        </div>
        <div 
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => handleTabChange('contacts')}
        >
          Contacts
        </div>
        <div 
          className={`tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => handleTabChange('password')}
        >
          Change Password
        </div>
        <div 
          className={`tab ${activeTab === 'steam' ? 'active' : ''}`}
          onClick={() => handleTabChange('steam')}
        >
          Steam Integration
        </div>
      </div>

      <div className="settings-content">
        {activeTab === 'personal' && (
          <div className="personal-tab">
            <div className="personal-group">
              <div className="input-group">
                <label>Username</label>
                <input 
                  type="text"
                  value={formData.personal.username}
                  onChange={e => handleChange('personal', 'username', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Date of Birth</label>
                <input 
                  type="date"
                  value={formData.personal.birthDate}
                  onChange={e => handleChange('personal', 'birthDate', e.target.value)}
                />
              </div>
              <div className="input-group">
                <label>Bio</label>
                <textarea 
                  className="bio-input"
                  value={formData.personal.bio}
                  onChange={e => handleChange('personal', 'bio', e.target.value)}
                />
              </div>
              <button 
                className="save-btn"
                onClick={handleSavePersonal}
                disabled={isLoadingCredits}
              >
                {isLoadingCredits ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            <div className="avatar-group" style={{ marginTop: '40px' }}>
              <div className="input-group">
                <label>Avatar</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                />
                {avatarFile && (
                  <img 
                    src={URL.createObjectURL(avatarFile)} 
                    alt="Preview" 
                    className="avatar-preview"
                  />
                )}
              </div>
              <button 
                className="save-btn"
                onClick={handleUpdateAvatar}
                disabled={!avatarFile || isLoadingAvatar}
              >
                {isLoadingAvatar ? 'Updating...' : 'Update Avatar'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-tab">
            <div className="input-group">
              <label>Telegram</label>
              <input 
                type="text"
                value={formData.contacts.telegram}
                onChange={e => handleChange('contacts', 'telegram', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Discord</label>
              <input 
                type="text"
                value={formData.contacts.discord}
                onChange={e => handleChange('contacts', 'discord', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Steam</label>
              <input 
                type="text"
                value={formData.contacts.steam}
                onChange={e => handleChange('contacts', 'steam', e.target.value)}
              />
            </div>
            <button 
              className="save-btn"
              onClick={handleSaveContacts}
              disabled={isLoadingCredits}
            >
              {isLoadingCredits ? 'Saving...' : 'Save Contacts'}
            </button>
          </div>
        )}

        {activeTab === 'password' && (
          <div className="password-tab">
            <div className="input-group">
              <label>Current Password</label>
              <input 
                type="password"
                value={formData.password.currentPassword}
                onChange={e => handleChange('password', 'currentPassword', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>New Password</label>
              <input 
                type="password"
                value={formData.password.newPassword}
                onChange={e => handleChange('password', 'newPassword', e.target.value)}
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input 
                type="password"
                value={formData.password.confirmPassword}
                onChange={e => handleChange('password', 'confirmPassword', e.target.value)}
              />
            </div>
            {errors.password && <p className="error">{errors.password}</p>}
            <button 
              className="save-btn"
              onClick={handlePasswordSubmit}
              disabled={
                isLoadingCredits || 
                !formData.password.newPassword || 
                formData.password.newPassword !== formData.password.confirmPassword
              }
            >
              {isLoadingCredits ? 'Updating...' : 'Change Password'}
            </button>
          </div>
        )}

        {activeTab === 'steam' && (
          <div className="steam-tab">
            <p>To connect Steam, click the button below:</p>
            <button 
              className="save-btn"
              onClick={() => window.location.href = `${API_BASE_URL}/auth/steam/login`}
            >
              Connect Steam
            </button>
          </div>
        )}
      </div>

      {successMessage && <div className="success">{successMessage}</div>}
      {errors.common && <div className="error">{errors.common}</div>}
    </div>
  );
};

export default ProfileSettings;