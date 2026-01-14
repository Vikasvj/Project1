import { Button, Typography, Box } from '@mui/material'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase';

export default function Dashboard() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <Box sx={{ textAlign: 'center', mt: 10 }}>
      <Typography variant="h4">Welcome, {user?.email}</Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  )
}
