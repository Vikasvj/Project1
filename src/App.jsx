import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "./supabase";
import { useAuth } from "./context/AuthContext";
import AdminAddProduct from "./pages/AdminAddProduct";

import Navbar from "./components/Nabvar";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Status from "./pages/Status";
import RequestService from "./pages/RequestServiceModal";
import Home from "./pages/Home";
import AdminList from "./pages/AdminList";
import ProductDetail from "./pages/ProductDetail";
import CustomerRequests from "./pages/CustomerRequests"

// 🔒 Protected route for logged-in users
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  return children;
}

// 🛡️ Admin-only route
function AdminRoute({ children, role }) {
  if (role !== "admin") return <Navigate to="/home" replace />;
  return children;
}

export default function App() {
  const { user, loading } = useAuth();
  const [role, setRole] = useState(null);

  // 🧠 Fetch user role from Supabase
  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error && data) {
          setRole(data.role);
        }
      } else {
        setRole(null);
      }
    };

    fetchRole();
  }, [user]);

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <Routes>
        {/* ✅ Public routes */}
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ✅ Protected user routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-service"
          element={
            <ProtectedRoute>
              <RequestService />
            </ProtectedRoute>
          }
        />
        <Route
          path="/status"
          element={
            <ProtectedRoute>
              <Status />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin-list"
          element={
            <AdminRoute role={role}>
              <AdminList />
            </AdminRoute>
          }
        />

        <Route
          path="/admin-add-product"
          element={
            <AdminRoute role={role}>
              <AdminAddProduct />
            </AdminRoute>
          }
        />
        <Route
          path="/customer-requests"
          element={
            <ProtectedRoute>
              <CustomerRequests />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}
