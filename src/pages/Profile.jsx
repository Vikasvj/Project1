import { Box, Typography, Paper, CircularProgress } from '@mui/material'
import { useEffect, useState } from 'react'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('profiles')
        .select('name, contact')
        .eq('id', user.id)
        .single()
      if (!error) setProfile(data)
      setLoading(false)
    }
    fetchProfile()
  }, [user])

  if (loading) return <CircularProgress sx={{ mt: 5 }} />

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', mt: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" gutterBottom>
          My Profile
        </Typography>
        <Typography><strong>Name:</strong> {profile?.name}</Typography>
        <Typography><strong>Email:</strong> {user?.email}</Typography>
        <Typography><strong>Contact:</strong> {profile?.contact}</Typography>
        <Typography><strong>Address:</strong> {profile?.address || 'Not added yet'}</Typography>
      </Paper>
    </Box>
  )
}
