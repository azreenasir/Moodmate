import React from 'react';
import { Box, Typography, Link, Container, useTheme } from '@mui/material';

const Footer: React.FC = () => {
    const theme= useTheme();

    return (
    <Box
      component="footer"
      sx={{
        backgroundColor:  theme.palette.background.default,
        color: theme.palette.text.primary,
        py: 2,
        borderTop: `1px solid ${theme.palette.divider}`
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: 'center' }}>
        <Typography variant="body2">
          © {new Date().getFullYear()} Moodmate. All rights reserved.
        </Typography>
        <Typography variant="body2">
          Built with 💙 by{' '}
          <Link
            href="https://github.com/azreenasir"
            target="_blank"
            rel="noopener"
            underline="hover"
            color="inherit"
          >
            Azree Nasir
          </Link>
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
