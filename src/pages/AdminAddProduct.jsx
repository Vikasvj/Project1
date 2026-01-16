import { useState } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  IconButton,
} from '@mui/material'
import { supabase } from '../supabase'
import { useAuth } from '../context/AuthContext'
import DeleteIcon from '@mui/icons-material/Close'

export default function AdminAddProduct() {
  const { user } = useAuth()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [quantity, setQuantity] = useState('')
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false) // ✅ new
  const [message, setMessage] = useState('')

  // 🔹 Upload images to Cloudinary
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length + images.length > 4) {
      alert('You can upload a maximum of 4 images.')
      return
    }

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        )
        const data = await res.json()
        if (data.secure_url) uploadedUrls.push(data.secure_url)
      } catch (err) {
        console.error('Upload error:', err)
        alert('Error uploading image.')
      }
    }

    setImages((prev) => [...prev, ...uploadedUrls])
    setUploading(false)
  }

  // 🔹 Remove image
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // 🔹 Reset form
  const handleReset = () => {
    setName('')
    setDescription('')
    setQuantity('')
    setImages([])
    setMessage('')
  }

  // 🔹 Submit product
  const handleSubmit = async () => {
    if (!name || images.length === 0) {
      alert('Please enter product name and upload at least one image.')
      return
    }

    const { error } = await supabase.from('products').insert([
      {
        admin_id: user.id,
        name,
        description,
        quantity: parseInt(quantity) || 0,
        images,
      },
    ])

    if (error) {
      console.error(error)
      alert('Error adding product.')
    } else {
      setUploadSuccess(true) // ✅ form hide trigger
      setMessage('✅ Product added successfully!')
    }
  }

  // ✅ If upload success → show success message only
  if (uploadSuccess) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          mt: 10,
          p: 4,
          boxShadow: 3,
          borderRadius: 3,
          backgroundColor: '#fff',
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <Typography variant="h5" color="success.main" gutterBottom>
          {message}
        </Typography>
        <Typography color="text.secondary">
          You can now close this page or add another product.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => {
            handleReset()
            setUploadSuccess(false) // 🔁 reset form visible again
          }}
        >
          Add Another Product
        </Button>
      </Box>
    )
  }

  // ✅ Main form (only visible before upload success)
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 6,
        p: 4,
        boxShadow: 3,
        borderRadius: 3,
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add New Product
      </Typography>

      <TextField
        fullWidth
        label="Product Name"
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        fullWidth
        label="Description"
        margin="normal"
        multiline
        rows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <TextField
        fullWidth
        label="Quantity Available"
        margin="normal"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <Button
        variant="contained"
        component="label"
        sx={{ mt: 2 }}
        disabled={uploading}
      >
        {uploading ? 'Uploading...' : 'Upload Images'}
        <input type="file" hidden multiple accept="image/*" onChange={handleImageUpload} />
      </Button>

      {/* 🔹 Image Previews (small passport-like) */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {images.map((url, idx) => (
          <Grid item xs={3} key={idx} sx={{ position: 'relative' }}>
            <Paper
              sx={{
                width: '100%',
                height: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              <img
                src={url}
                alt="product"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Paper>

            {/* ❌ Remove Button */}
            <IconButton
              size="small"
              sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                background: 'rgba(255,255,255,0.8)',
                '&:hover': { background: 'red', color: '#fff' },
              }}
              onClick={() => handleRemoveImage(idx)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid>
        ))}
      </Grid>

      {uploading && (
        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          onClick={handleSubmit}
          disabled={uploading}
        >
          Add Product
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          onClick={handleReset}
          disabled={uploading}
        >
          Reset
        </Button>
      </Box>
    </Box>
  )
}
