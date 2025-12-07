import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Sync as SyncIcon
} from '@mui/icons-material';
import { platformsAPI, authAPI, syncAPI, ordersAPI, productsAPI } from '../services/api';

const Dashboard = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('woocommerce');
  const [formData, setFormData] = useState({
    storeUrl: '',
    consumerKey: '',
    consumerSecret: '',
    shopDomain: '',
    accessToken: '',
    platformName: ''
  });
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [ordersStats, inventoryStats] = await Promise.all([
        ordersAPI.getOrderStats(),
        productsAPI.getInventoryStats()
      ]);
      setStats({
        orders: ordersStats.data.data.stats,
        inventory: inventoryStats.data.data.stats
      });
    } catch (err) {
      console.error('Failed to load stats', err);
    }
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [platformsRes, userRes] = await Promise.all([
        platformsAPI.getPlatforms(),
        authAPI.getCurrentUser()
      ]);
      setPlatforms(platformsRes.data.data.platforms);
      setUser(userRes.data.data.user);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (type) => {
    setDialogType(type);
    setOpenDialog(true);
    setFormData({
      storeUrl: '',
      consumerKey: '',
      consumerSecret: '',
      shopDomain: '',
      accessToken: '',
      platformName: ''
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConnect = async () => {
    try {
      setError('');
      let response;
      
      if (dialogType === 'woocommerce') {
        response = await platformsAPI.connectWooCommerce({
          storeUrl: formData.storeUrl,
          consumerKey: formData.consumerKey,
          consumerSecret: formData.consumerSecret,
          platformName: formData.platformName
        });
      } else {
        // Log the data being sent for debugging
        console.log('Connecting Shopify with:', JSON.stringify({
          shopDomain: formData.shopDomain,
          accessTokenLength: formData.accessToken?.length,
          accessTokenPrefix: formData.accessToken?.substring(0, 10) + '...',
          hasPlatformName: !!formData.platformName
        }, null, 2));
        
        response = await platformsAPI.connectShopify({
          shopDomain: formData.shopDomain,
          accessToken: formData.accessToken,
          platformName: formData.platformName
        });
      }

      handleCloseDialog();
      loadData();
    } catch (err) {
      console.error('Connection error:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      console.error('Full error:', JSON.stringify(err.response?.data, null, 2));
      
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        const errorMessages = err.response.data.errors.map(e => e.msg || e.message || JSON.stringify(e)).join(', ');
        setError(errorMessages);
      } else if (err.response?.data?.error) {
        setError(err.response.data.error.message || JSON.stringify(err.response.data.error));
      } else {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Failed to connect platform. Check console for details.'
        );
      }
    }
  };

  const handleDisconnect = async (id) => {
    if (!window.confirm('Are you sure you want to disconnect this platform?')) {
      return;
    }

    try {
      await platformsAPI.disconnectPlatform(id);
      loadData();
    } catch (err) {
      setError('Failed to disconnect platform');
    }
  };

  const handleSyncAll = async () => {
    if (platforms.length < 2) {
      setError('You need at least 2 connected platforms to sync');
      return;
    }

    try {
      setSyncing(true);
      setError('');
      await syncAPI.syncAll();
      setError('');
      alert('Sync completed successfully!');
      loadData();
      loadStats();
    } catch (err) {
      setError('Sync failed: ' + (err.response?.data?.error?.message || 'Unknown error'));
    } finally {
      setSyncing(false);
    }
  };

  const getPlatformIcon = (type) => {
    return type === 'shopify' ? '🛍️' : type === 'woocommerce' ? '🛒' : '📦';
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : status === 'error' ? 'error' : 'default';
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
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            SyncFlow Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome, {user?.firstName || user?.email}!
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('woocommerce')}
            sx={{ mr: 1 }}
          >
            Connect WooCommerce
          </Button>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('shopify')}
          >
            Connect Shopify
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Connected Platforms ({platforms.length})
            </Typography>
            {platforms.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  No platforms connected yet
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Connect your first platform to get started
                </Typography>
              </Box>
            ) : (
              <List>
                {platforms.map((platform) => (
                  <ListItem
                    key={platform.id}
                    sx={{
                      border: '1px solid #e0e0e0',
                      borderRadius: 1,
                      mb: 1
                    }}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        onClick={() => handleDisconnect(platform.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <span style={{ fontSize: '24px' }}>
                            {getPlatformIcon(platform.platform_type)}
                          </span>
                          <Typography variant="subtitle1">
                            {platform.platform_name || platform.platform_type}
                          </Typography>
                          <Chip
                            label={platform.platform_type}
                            size="small"
                            sx={{ ml: 1 }}
                          />
                          <Chip
                            label={platform.status}
                            size="small"
                            color={getStatusColor(platform.status)}
                            sx={{ ml: 1 }}
                          />
                        </Box>
                      }
                      secondary={
                        platform.last_sync_at
                          ? `Last synced: ${new Date(platform.last_sync_at).toLocaleString()}`
                          : 'Never synced'
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active Platforms: {platforms.filter(p => p.status === 'active').length}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Subscription: {user?.subscriptionTier || 'Free'}
              </Typography>
              {stats && (
                <>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Total Orders: {stats.orders?.total_orders || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Total Products: {stats.inventory?.total_products || 0}
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
          {platforms.length >= 2 && (
            <Paper sx={{ p: 3 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<SyncIcon />}
                onClick={handleSyncAll}
                disabled={syncing}
              >
                {syncing ? 'Syncing...' : 'Sync All Platforms'}
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Connect Platform Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Connect {dialogType === 'woocommerce' ? 'WooCommerce' : 'Shopify'}
        </DialogTitle>
        <DialogContent>
          {dialogType === 'woocommerce' ? (
            <>
              <TextField
                fullWidth
                label="Store URL"
                name="storeUrl"
                value={formData.storeUrl}
                onChange={handleChange}
                margin="normal"
                placeholder="https://yourstore.com"
                required
              />
              <TextField
                fullWidth
                label="Consumer Key"
                name="consumerKey"
                value={formData.consumerKey}
                onChange={handleChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Consumer Secret"
                name="consumerSecret"
                value={formData.consumerSecret}
                onChange={handleChange}
                margin="normal"
                type="password"
                required
              />
              <TextField
                fullWidth
                label="Platform Name (Optional)"
                name="platformName"
                value={formData.platformName}
                onChange={handleChange}
                margin="normal"
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Shop Domain"
                name="shopDomain"
                value={formData.shopDomain}
                onChange={handleChange}
                margin="normal"
                placeholder="silkorc"
                helperText="Enter just your shop name (e.g., 'silkorc'). Full URLs are automatically handled."
                required
              />
              <TextField
                fullWidth
                label="Access Token"
                name="accessToken"
                value={formData.accessToken}
                onChange={handleChange}
                margin="normal"
                type="password"
                helperText="Get this from Shopify Admin > Settings > Apps > Develop apps > Your App > Admin API access token"
                required
              />
              <TextField
                fullWidth
                label="Platform Name (Optional)"
                name="platformName"
                value={formData.platformName}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConnect} variant="contained">
            Connect
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
