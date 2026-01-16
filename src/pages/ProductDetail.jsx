import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useParams } from 'react-router-dom';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setProduct(data);
    };
    fetchProduct();
  }, [id]);

  if (!product) return <Typography>Loading...</Typography>;

  const handlePrev = () => {
    setCurrentImage((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImage((prev) => (prev === product.images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 5, textAlign: 'center' }}>
      <Box sx={{ position: 'relative' }}>
        <img
          src={product.images[currentImage]}
          alt={product.name}
          style={{ width: '100%', borderRadius: 8 }}
        />

        {/* Arrows */}
        {product.images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 10,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.6)',
              }}
            >
              <ArrowBackIos />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 10,
                transform: 'translateY(-50%)',
                backgroundColor: 'rgba(255,255,255,0.6)',
              }}
            >
              <ArrowForwardIos />
            </IconButton>
          </>
        )}
      </Box>

      <Typography variant="h5" sx={{ mt: 2 }}>
        {product.name}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
        {product.description}
      </Typography>
    </Box>
  );
}
