import ProfileSettings from '@/components/Profile-settings/Profile-settings';

export default function ProfileSettingsPage({ profileData, currProfile }) {
  return (
    <ProfileSettings profileData={profileData} updateProfile={currProfile} />
  );
}
