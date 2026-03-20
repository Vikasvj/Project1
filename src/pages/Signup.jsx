import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { supabase } from "../supabase";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    setLoading(true);

    try {
      // 🔹 Step 1️⃣ — Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/login", // 👈 after verification, redirect here
        },
      });

      if (signUpError) {
        if (
          signUpError.message.includes("User already registered") ||
          signUpError.status === 400
        ) {
          setError("This email is already registered. Please login instead.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        // 👇 happens when email verification is required
        alert(
          "Signup successful! Please check your email to verify your accoun."
        );
        setLoading(false);
        return;
      }

      console.log("✅ User UUID:", user.id);

      alert(
        "Signup successful! "
      );

      // Reset form

      setEmail("");
      setPassword("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: 400,
        mx: "auto",
        mt: 8,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Signup
      </Typography>

      <TextField
        fullWidth
        label="Email"
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleSignup}
        disabled={loading}
      >
        {loading ? "Creating Account..." : "Sign Up"}
      </Button>
    </Box>
  );
}
