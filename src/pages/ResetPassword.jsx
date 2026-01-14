import { useState, useEffect } from 'react'
import { Box, TextField, Button, Typography, Alert } from '@mui/material'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if we're in recovery mode
    const checkRecovery = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      console.log('Session in reset page:', session)
      
      // Check URL params
      const urlParams = new URLSearchParams(window.location.hash.substring(1))
      const type = urlParams.get('type')
      
      if (type === 'recovery' || session?.user?.recovery_mode) {
        setIsRecoveryMode(true)
        console.log('✅ Recovery mode detected')
      } else {
        setError('❌ Invalid reset link. Please request a new one.')
      }
    }
    
    checkRecovery()
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event) => {
        console.log('Auth event in reset:', event)
        if (event === 'PASSWORD_RECOVERY') {
          setIsRecoveryMode(true)
        }
      }
    )
    
    return () => subscription.unsubscribe()
  }, [])

  const handleReset = async () => {
    setError('')
    setMsg('')
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      })
      
      if (updateError) throw updateError
      
      setMsg('✅ Password updated successfully!')
      
      // Sign out and redirect
      setTimeout(async () => {
        await supabase.auth.signOut()
        navigate('/login')
      }, 2000)
      
    } catch (err) {
      console.error('Update error:', err)
      setError(err.message || 'Failed to update password')
    }
  }

  if (!isRecoveryMode) {
    return (
      <Box sx={{ width: 400, mx: 'auto', mt: 8, p: 3 }}>
        <Alert severity="error">
          Invalid or expired reset link. 
          <Button onClick={() => navigate('/login')} sx={{ ml: 2 }}>
            Go to Login
          </Button>
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ width: 400, mx: 'auto', mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>Set New Password</Typography>
      
      <TextField
        fullWidth
        label="New Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        margin="normal"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {msg && <Alert severity="success" sx={{ mt: 2 }}>{msg}</Alert>}
      
      <Button 
        variant="contained" 
        fullWidth 
        sx={{ mt: 2 }}
        onClick={handleReset}
        disabled={!password || !confirmPassword}
      >
        Update Password
      </Button>
    </Box>
  )
}