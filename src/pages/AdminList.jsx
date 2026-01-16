import { Box, Typography, Button, Grid, Paper } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../supabase'
import { useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'

export default function AdminList() {
  const { role, user } = useAuth()   // role mil raha AuthContext se
  const navigate = useNavigate()
  const [products, setProducts] = useState([])

  // 🔹 Fetch products for this admin
  const fetchProducts = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('admin_id', user.id)
      .order('id', { ascending: true })

    if (!error) setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleAddProduct = () => {
    navigate('/admin-add-product')
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      alert('✅ Product deleted!')
      fetchProducts() // refresh list
    }
  }

  if (role !== 'admin') {
    return (
      <Box sx={{ textAlign: 'center', mt: 8 }}>
        <Typography variant="h5" color="error">
          ❌ Access Denied
        </Typography>
        <Typography color="text.secondary">
          You do not have permission to view this page.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 6, px: 2 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Here you can manage your products. Add new items or delete existing ones.
      </Typography>

      {/* Add Product Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddProduct}
        sx={{ px: 3, py: 1, mb: 4 }}
      >
        ➕ Add New Product
      </Button>

      {/* Product List */}
      <Grid container spacing={2}>
        {products.map((product, index) => (
          <Grid item xs={12} key={product.id}>
            <Paper
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                gap: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {/* Number */}
              <Typography variant="h6" sx={{ width: 30 }}>
                {index + 1}.
              </Typography>

              {/* Image */}
              <Box
                component="img"
                src={product.images?.[0] || ''}
                alt={product.name}
                sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1 }}
              />

              {/* Info */}
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description?.slice(0, 80) || 'No description'}
                  {product.description && product.description.length > 80 ? '...' : ''}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  Quantity: {product.quantity}
                </Typography>
              </Box>

              {/* Delete */}
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDelete(product.id)}
                startIcon={<DeleteIcon />}
              >
                Delete
              </Button>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
