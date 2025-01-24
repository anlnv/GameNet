import Profile from '@/components/Profile/Profile';
import LoadingPage from '@/components/Loading/Loading';
import { useAuth } from '@/utils/useAuth';

export default function ProfilePage() {
  const { profileData, loading } = useAuth();

  if (loading) return <LoadingPage />;

  return <Profile profileData={profileData} />;
}
