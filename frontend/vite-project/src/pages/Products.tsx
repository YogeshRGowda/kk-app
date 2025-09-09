import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { apiService, Product } from '../services/api';

const Products = () => {
  const [open, setOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const queryClient = useQueryClient();

  const { data: products, isLoading, error } = useQuery('products', async () => {
    const response = await fetch('http://localhost:5000/api/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  });

  const createProductMutation = useMutation(apiService.createProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      setOpen(false);
      setNewProduct({});
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createProductMutation.mutate(newProduct as Omit<Product, 'id'>);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error loading products</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Products</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      <List>
        {products?.map((product: any) => (
          <ListItem key={product.id}>
            <ListItemText
              primary={product.name}
              secondary={product.description}
            />
          </ListItem>
        ))}
      </List>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              fullWidth
              required
              value={newProduct.name || ''}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newProduct.description || ''}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Test Type"
              fullWidth
              value={newProduct.test_type || ''}
              onChange={(e) => setNewProduct({ ...newProduct, test_type: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Base URL"
              fullWidth
              value={newProduct.base_url || ''}
              onChange={(e) => setNewProduct({ ...newProduct, base_url: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">
              Add
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Products; 