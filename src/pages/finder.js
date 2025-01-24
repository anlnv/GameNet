import Finder from "@/components/Finder/Finder";
import LoadingPage from "@/components/Loading/Loading";
import { useAuth } from "@/utils/useAuth";

export default function FinderPage() {
  const { profileData, loading } = useAuth();

  if (loading) return <LoadingPage />;

  return <Finder profileData={profileData} />;
}
