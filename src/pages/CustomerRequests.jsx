import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  TextField,
  Pagination,
  Stack,
} from "@mui/material";
import { supabase } from "../supabase";

export default function CustomerRequests() {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 5; // per page

  // 🟢 Fetch requests (with search + pagination)
  useEffect(() => {
    const fetchRequests = async () => {
      let query = supabase
        .from("repair_requests")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * limit, page * limit - 1);

      if (search.trim() !== "") {
        query = query.ilike("complaint_number", `%${search.trim()}%`);
      }

      const { data, count, error } = await query;
      if (!error) {
        setRequests(data);
        setTotal(count || 0);
      }
    };
    fetchRequests();
  }, [page, search]);

  // 🟡 Update status
  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("repair_requests")
      .update({ status: newStatus })
      .eq("id", id);
    if (!error) {
      setRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: newStatus } : req))
      );
    }
  };

  // 🔴 Delete complaint
  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;
    const { error } = await supabase
      .from("repair_requests")
      .delete()
      .eq("id", id);
    if (!error) setRequests((prev) => prev.filter((req) => req.id !== id));
  };

  // 🎨 Status color
  const getColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "ongoing":
        return "info";
      case "resolved":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🧾 Customer Complaints
      </Typography>

      {/* 🔹 Status Color Legend */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Chip label="Pending" color="warning" />
        <Chip label="Ongoing" color="info" />
        <Chip label="Resolved" color="success" />
        <Chip label="Cancelled" color="error" />
      </Stack>

      {/* 🔍 Search bar */}
      <TextField
        label="Search by Complaint Number"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {requests.length === 0 ? (
        <Typography align="center" color="text.secondary">
          No complaints found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {requests.map((req, idx) => (
            <Grid item xs={12} key={req.id}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: 3,
                  borderRadius: 2,
                }}
              >
                {/* Left Section */}
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    #{(page - 1) * limit + idx + 1} — {req.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {req.details}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Complaint No: {req.complaint_number}
                  </Typography>
                </Box>

                {/* Right Section */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip label={req.status} color={getColor(req.status)} />

                  {req.status !== "resolved" && (
                    <Button
                      variant="outlined"
                      color="success"
                      size="small"
                      onClick={() => updateStatus(req.id, "resolved")}
                    >
                      Resolve
                    </Button>
                  )}

                  {req.status !== "cancelled" && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => updateStatus(req.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  )}

                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => deleteRequest(req.id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* 🔽 Pagination */}
      {total > limit && (
        <Pagination
          count={Math.ceil(total / limit)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
          sx={{ mt: 4, display: "flex", justifyContent: "center" }}
        />
      )}
    </Box>
  );
}
