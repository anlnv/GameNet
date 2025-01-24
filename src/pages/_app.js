import { useState, useEffect } from "react";
import { useRouter } from 'next/router'
import { callAPI } from "@/utils/api";
import Header from "../components/Header/Header";
import LoadingPage from "@/components/Loading/Loading";
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found");

      const data = await callAPI("/user/me");
      setProfileData(data);
      setIsLoggedIn(true);

      // if (router.pathname !== "/profile") {
      //   router.push("/profile");
      // }
    } catch (error) {
      console.error(`Ошибка авторизации: ${error.message}`);
      localStorage.removeItem("token");
      setIsLoggedIn(false);

      // Переход на /login только если мы не там
      if (router.pathname !== "/login") {
        router.push("/login");
      }
    } finally {
      setIsAuthChecked(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthChecked) {
      checkAuth();
    }
  }, [isAuthChecked]);

  const handleLoginSuccess = (token) => {
    localStorage.setItem("token", token);
    setIsLoggedIn(true);
    router.push('/profile');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setProfileData(null);
    setIsLoggedIn(false);
    router.push('/login');
  };

  if (loading) return <LoadingPage/>

  // if (error) return <div>Error: {error}</div>;

  return (
    <div className="page">
      {isLoggedIn && <Header onLogout={handleLogout} />}
      {!isLoggedIn ? (
        <Component
        {...pageProps}
        profileData={profileData}
        onLoginSuccess={handleLoginSuccess}
        isAuthChecked={isAuthChecked}
        // isLoggedIn={isLoggedIn}
        // handleLoginSuccess={handleLoginSuccess}
        // handleLogout={handleLogout}
      />
      ) : (
        <Component {...pageProps} profileData={profileData} />
      )}
    </div>
  );

  // return (
  //   <div className="page">
  //     {isLoggedIn && <Header onLogout={handleLogout} />}
  //       {!isLoggedIn ? (
  //         <>
  //           {isAuthChecked && (
  //             <>
  //               <Route
  //                 path="/login"
  //                 element={<Login onLoginSuccess={handleLoginSuccess} />}
  //               />
  //               <Route path="/register" element={<Register />} />
  //               <Route path="*" element={<Navigate to="/login" />} />
  //             </>
  //           )}
  //         </>
  //       ) : (
  //         <>
  //           <Route
  //             path="/home"
  //             element={
  //               <div>
  //                 <Profile profileData={profileData} />
  //                 <UserWall profileData={profileData} />
  //               </div>
  //             }
  //           />
  //           <Route path="/feed" element={<Feed />} />
  //           <Route
  //             path="/profile-settings"
  //             element={
  //               <ProfileSettings
  //                 profileData={profileData}
  //                 updateProfile={checkAuth}
  //               />
  //             }
  //           />
  //           <Route path="/survey" element={<Survey />} />
  //           <Route path="/finder" element={<Finder profileData={profileData} />} />
  //           <Route path="/communities" element={<Communities profileData={profileData}/>} />
  //           <Route path="/users" element={<Users />} />
  //           <Route path="/community/:id" element={<CommunityDetails profileData={profileData} />} />
  //           <Route path="/user/:userId" element={<User currentUser={profileData}/>} />
  //           <Route path="*" element={<Navigate to="/home" />} />
  //         </>
  //       )}
  //   </div>
  // );
}
