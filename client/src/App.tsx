import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
// import PrivateRoute from './routes/PrivateRoute';
import Dashboard from './pages/Dashboard';
import AddJournal from './pages/AddJournal';
import Navbar from './components/Navbar';
import Analytics from './pages/Analytics';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, CircularProgress, Typography } from '@mui/material';

const App: React.FC = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (isLoading) {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: '#121212', // or match your app background
        color: 'white',
      }}
    >
      <CircularProgress color="primary" />
      <Typography mt={2}>Authenticating...</Typography>
    </Box>
  );
}

  if (error) {
    return <div>Auth Error: {error.message}</div>;
  }

  return (
    <>
      {isAuthenticated && <Navbar />}
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />
        <Route path="/add-journal" element={ isAuthenticated ? <AddJournal /> : <Navigate to="/login" replace/>} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </>
  );
};

export default App;
