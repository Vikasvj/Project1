import { useState } from 'react'
import { Box, TextField, Button, Typography } from '@mui/material'
import { supabase } from '../supabase'

export default function Signup() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    setError('')

    // 🔹 Step 0️⃣ — Validate 10-digit mobile number
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(contact)) {
      setError('Please enter a valid 10-digit mobile number.')
      return
    }

    setLoading(true)

    try {
      // 🔹 Step 1️⃣ — Create user in Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'http://localhost:5173/login', // 👈 after verification, redirect here
        },
      })

      if (signUpError) {
        if (
          signUpError.message.includes('User already registered') ||
          signUpError.status === 400
        ) {
          setError('This email is already registered. Please login instead.')
        } else {
          setError(signUpError.message)
        }
        setLoading(false)
        return
      }

      const user = data.user
      if (!user) {
        // 👇 happens when email verification is required
        alert('Signup successful! Please check your email to verify your account.')
        setLoading(false)
        return
      }

      console.log('✅ User UUID:', user.id)

      // 🔹 Step 2️⃣ — Insert name & contact in profiles table
      const { error: insertError } = await supabase.from('profiles').insert([
        {
          id: user.id,
          name,
          contact,
          email: user.email,
        },
      ])

      if (insertError) {
        setError(insertError.message)
        setLoading(false)
        return
      }

      alert('Signup successful! Please check your email to verify your account.')

      // Reset form
      setName('')
      setContact('')
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    }

    setLoading(false)
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
        Signup
      </Typography>

      <TextField
        fullWidth
        label="Name"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        fullWidth
        label="Contact (10 digits)"
        margin="normal"
        value={contact}
        onChange={(e) => setContact(e.target.value)}
      />

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
        {loading ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </Box>
  )
}
