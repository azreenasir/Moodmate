import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';
import logo from '../images/Moodmate-black_bg.png';

const Login: React.FC = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#121212',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          width: '90%',
          maxWidth: 400,
          textAlign: 'center',
          backgroundColor: '#1e1e1e',
          borderRadius: 3,
          color: 'white',
        }}
      >
        <img
          src={logo}
          alt="moodmate"
          style={{
            width: '150px',
            height: 'auto',
            marginBottom: '20px',
            borderRadius: '500px',
          }}
        />

        <Typography variant="h4" gutterBottom fontWeight={600} align="center">
          Welcome 👋
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          sx={{ mb: 3, color: '#b0b0b0' }}
        >
          Sign in with your Google account or email
        </Typography>

        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => loginWithRedirect()}
          sx={{
            backgroundColor: '#1976d2',
            color: '#fff',
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
        >
          Continue with Google / Email
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
