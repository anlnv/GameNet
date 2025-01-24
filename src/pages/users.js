import Users from "@/components/Users/Users";
import { useAuth } from '@/utils/useAuth';
import LoadingPage from '@/components/Loading/Loading';

export default function UsersPage() {
    const { profileData, loading } = useAuth();

    if (loading) return <LoadingPage />;

    return <Users currentUser={profileData}/>
}
