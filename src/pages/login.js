import Login from '../components/Login/Login';

export default function LoginPage() {
  const handleLoginSuccess = (token) => {
    if (token) {
      console.log("Login successful! Token:", token);
    }
  };
  
  return <Login onLoginSuccess={handleLoginSuccess}/>;
}
