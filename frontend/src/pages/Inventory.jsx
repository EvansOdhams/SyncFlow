import React, { useState, useEffect } from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  TextField,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  InputAdornment
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { productsAPI } from '../services/api';

const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchSku, setSearchSku] = useState('');

  useEffect(() => {
    loadData();
  }, [searchSku]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsRes, statsRes] = await Promise.all([
        productsAPI.getProducts({ sku: searchSku }),
        productsAPI.getInventoryStats()
      ]);
      setProducts(productsRes.data.data.products);
      setStats(statsRes.data.data.stats);
    } catch (err) {
      setError('Failed to load inventory');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStockColor = (stock, availableStock) => {
    if (stock === 0) return 'error';
    if (availableStock <= 10) return 'warning';
    return 'success';
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Inventory
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Products
                </Typography>
                <Typography variant="h4">
                  {stats.total_products || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Stock
                </Typography>
                <Typography variant="h4">
                  {stats.total_stock || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Out of Stock
                </Typography>
                <Typography variant="h4" color="error.main">
                  {stats.out_of_stock || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Card>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Low Stock
                </Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.low_stock || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Search by SKU..."
          value={searchSku}
          onChange={(e) => setSearchSku(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            )
          }}
        />
      </Paper>

      {/* Products Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>SKU</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Current Stock</TableCell>
              <TableCell>Available Stock</TableCell>
              <TableCell>Platforms</TableCell>
              <TableCell>Last Synced</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="textSecondary" sx={{ py: 4 }}>
                    No products found
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.current_stock}
                      color={getStockColor(product.current_stock, product.available_stock)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{product.available_stock}</TableCell>
                  <TableCell>{product.platform_count || 0}</TableCell>
                  <TableCell>
                    {product.last_synced
                      ? new Date(product.last_synced).toLocaleString()
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Inventory;

