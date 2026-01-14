// src/Login.js
import { useState } from 'react'
import { Box, TextField, Button, Typography, Link } from '@mui/material'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')

  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    setMsg('')
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    setLoading(true)
    const {error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }
    alert('Login successful!')
    setLoading(false)
    navigate('/dashboard')
  }

  // 🟢 Forgot Password logic
  const handleForgotPassword = async () => {
    setError('')
    setMsg('')

    if (!email) {
      setError('Please enter your email first.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: 'http://localhost:5173/reset-password' // 👈 change to your app URL
    })

    if (error) {
      setError(error.message)
    } else {
      setMsg('Password reset link sent! Check your email.')
    }
  }

  return (
    <Box
      sx={{
        width: 400,
        mx: 'auto',
        mt: 8,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Login
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

      {error && <Typography color="error">{error}</Typography>}
      {msg && <Typography color="primary">{msg}</Typography>}

      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 2 }}
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      {/* 👇 Forgot Password button */}
      <Link
        component="button"
        variant="body2"
        sx={{ mt: 2, display: 'block' }}
        onClick={handleForgotPassword}
      >
        Forgot Password?
      </Link>
    </Box>
  )
}
