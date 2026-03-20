import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // ⏳ Jab tak auth check ho raha hai
  if (loading) return <p>Loading...</p>;

  // ❌ Agar login nahi hai
  if (!user) return <Navigate to="/login" />;

  // ✅ Agar login hai
  return children;
};

export default ProtectedRoute;