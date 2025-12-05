import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Dashboard = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          SyncFlow
        </Typography>
        <Typography variant="h5" color="text.secondary">
          Multi-Channel Inventory & Order Sync Platform
        </Typography>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Welcome to SyncFlow
        </Typography>
        <Typography variant="body1" paragraph>
          This is the dashboard. Implementation is in progress.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Status: Phase 0 - Setup & Planning
        </Typography>
      </Paper>
    </Container>
  );
};

export default Dashboard;

