import { useEffect, useState } from "react";
import { Box, Typography, Paper, Chip, CircularProgress, Grid } from "@mui/material";
import { supabase } from "../supabase";
import { useAuth } from "../context/AuthContext";

export default function Status() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("repair_requests")
        .select("complaint_number, title, detail, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error) setRequests(data);
      setLoading(false);
    };

    fetchRequests();
  }, [user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "in_progress":
        return "info";
      case "resolved":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading your requests...</Typography>
      </Box>
    );

  if (requests.length === 0)
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <Typography variant="h6" color="text.secondary">
          No requests found 📝
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
        My Repair Requests
      </Typography>

      <Grid container spacing={2}>
        {requests.map((req, idx) => (
          <Grid item xs={12} key={idx}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Complaint No: <strong>{req.complaint_number}</strong>
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {req.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {req.detail}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: "block", mt: 1 }}>
                  Requested on {new Date(req.created_at).toLocaleDateString()}
                </Typography>
              </Box>

              <Chip
                label={req.status.replace("_", " ").toUpperCase()}
                color={getStatusColor(req.status)}
                sx={{ fontWeight: "bold", px: 1.5, fontSize: "0.9rem" }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
