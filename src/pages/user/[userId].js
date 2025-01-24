import { useRouter } from "next/router";
import User from '@/components/User/User';

export default function UserPage({ profileData }) {
  const router = useRouter();
  const { userId } = router.query;
  
  return <User currentUser={profileData} userId={userId} />;
}
