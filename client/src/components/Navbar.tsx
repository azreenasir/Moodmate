import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Container,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useThemeContext } from '../context/ThemeContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout, loginWithRedirect, user } = useAuth0();
  const { toggleTheme, mode } = useThemeContext();

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const authLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Add Journal', path: '/add-journal' },
    { label: 'Mood Analytics', path: '/analytics' },
  ];

  return (
    <AppBar position="sticky" elevation={1} color="default">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/dashboard"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            MoodMate
          </Typography>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            {isAuthenticated && (
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            )}
            <IconButton onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {isAuthenticated &&
                authLinks.map((link) => (
                  <MenuItem key={link.label} onClick={handleCloseNavMenu}>
                    <Typography
                      component={Link}
                      to={link.path}
                      sx={{ textDecoration: 'none', color: 'inherit' }}
                    >
                      {link.label}
                    </Typography>
                  </MenuItem>
                ))}
              {isAuthenticated && (
                <MenuItem onClick={handleLogout}>
                  <Typography>Logout</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2, alignItems: 'center' }}>
            {isAuthenticated &&
              authLinks.map((link) => (
                <Button
                  key={link.label}
                  component={Link}
                  to={link.path}
                  sx={{ color: 'inherit', textTransform: 'none' }}
                >
                  {link.label}
                </Button>
              ))}

            {isAuthenticated ? (
              <Button onClick={handleLogout} sx={{ color: 'inherit' }}>
                Logout
              </Button>
            ) : (
              <Button onClick={() => loginWithRedirect()} sx={{ color: 'inherit' }}>
                Login
              </Button>
            )}

            <Avatar src={user?.picture || undefined}>
              {!user?.picture && <PersonIcon />}
            </Avatar>

            {isAuthenticated && (
              <IconButton onClick={toggleTheme} color="inherit">
                {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
