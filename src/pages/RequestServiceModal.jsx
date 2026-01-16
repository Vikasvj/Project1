import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'

export default function RequestServiceModal({ open, handleClose, userName }) {
  const { user } = useAuth()
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!address || !mobile || !title || !details) {
      alert('Please fill all fields!')
      return
    }

    setLoading(true)

    const { error } = await supabase.from('repair_requests').insert([
      {
        user_id: user.id,
        name: userName,
        mobile,
        address,
        title,
        detail: details,
        status: 'pending',
      },
    ])

    setLoading(false)

    if (error) {
      console.error(error)
      alert('❌ Error submitting request.')
    } else {
      alert('✅ Request submitted successfully!')
      setMobile('')
      setAddress('')
      setTitle('')
      setDetails('')
      handleClose() // popup close
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Request a Service</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={userName || ''}
          disabled
        />
        <TextField
          fullWidth
          label="Mobile Number"
          margin="normal"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <TextField
          fullWidth
          label="Address"
          margin="normal"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          fullWidth
          label="Service Title"
          margin="normal"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          fullWidth
          label="Service Details"
          margin="normal"
          multiline
          rows={3}
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
