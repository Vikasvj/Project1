import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import RequestServiceModal from "../pages/RequestServiceModal"; // 👈 Popup form component

export default function Navbar() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [profile, setProfile] = useState(null);
  const [openRequest, setOpenRequest] = useState(false);

  // 🔹 Fetch profile + role
  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, role")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  if (loading) return null;

  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          {/* Left: App Name */}
          <Typography
            variant="h6"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            MyApp
          </Typography>

          {/* Right: Buttons */}
          <Box>
            {!user ? (
              <>
                <Button color="inherit" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button color="inherit" onClick={() => navigate("/signup")}>
                  Signup
                </Button>
              </>
            ) : (
              <>
                {/* ✅ User Buttons */}
                {profile?.role === "user" && (
                  <>
                    <Button
                      color="inherit"
                      onClick={() => setOpenRequest(true)}
                    >
                      Request Service
                    </Button>
                    <Button color="inherit" onClick={() => navigate("/status")}>
                      Status
                    </Button>
                  </>
                )}

                {/* ✅ Admin Buttons */}
                {profile?.role === "admin" && (
                  <>
                    <Button
                      color="inherit"
                      onClick={() => navigate("/admin-list")}
                    >
                      Admin
                    </Button>
                    <Button
                      color="inherit"
                      onClick={() => navigate("/customer-requests")}
                    >
                      Customer Complaints
                    </Button>
                  </>
                )}

                {/* Profile Menu */}
                <Button
                  color="inherit"
                  onClick={handleMenuOpen}
                  startIcon={
                    <Avatar sx={{ width: 28, height: 28 }}>
                      {profile?.name?.[0] || "U"}
                    </Avatar>
                  }
                >
                  {profile?.name || "Profile"}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleProfileClick}>My Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* 🔹 Request Service Modal */}
      <RequestServiceModal
        open={openRequest}
        handleClose={() => setOpenRequest(false)}
        userName={profile?.name}
      />
    </>
  );
}
