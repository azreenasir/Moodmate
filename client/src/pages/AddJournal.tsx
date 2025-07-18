import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  Fade,
  useTheme,
  useMediaQuery
} from '@mui/material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';

const AddJournal: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const theme=useTheme();
  const isMobile=useMediaQuery(theme.breakpoints.down('sm'))

  const [text, setText] = useState('');
  const [mood, setMood] = useState<'happy' | 'neutral' | 'sad'>('happy');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const maxChars = 300;

  const apiUrl = process.env.REACT_APP_API_URL!;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    try {
      const accessToken = await getAccessTokenSilently({
        audience: apiUrl,
      } as any);

      await axios.post(
        '/journal',
        { text, selectedMood: mood },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setSuccessMsg('✅ Journal entry saved!');
      setText('');
      setMood('happy');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.error || 'Something went wrong.');
    }
  };

  return (
    <Container maxWidth="sm">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
      <Box mt={6} display="flex" flexDirection="column">
        <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={600} textAlign="center" mb={-5}>
          Add Journal Entry
        </Typography>

        <Fade in={!!error}>
          <Alert severity="error">{error}</Alert>
        </Fade>
        <Fade in={!!successMsg}>
          <Alert severity="success">{successMsg}</Alert>
        </Fade>

        <form onSubmit={handleSubmit}>
          <TextField
            label="How are you feeling today?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            multiline
            rows={5}
            required
            inputProps={{ maxLength: maxChars }}
            helperText={`${text.length}/${maxChars} characters`}
          />

          <FormLabel component="legend" sx={{ mt: 1, fontWeight: 500 }}>
            Select Your Mood
          </FormLabel>
          <RadioGroup
            row
            value={mood}
            onChange={(e) => setMood(e.target.value as 'happy' | 'neutral' | 'sad')}
          >
            <FormControlLabel
              value="happy"
              control={<Radio sx={{ color: '#FFD54F' }} />}
              label="😊"
            />
            <FormControlLabel
              value="neutral"
              control={<Radio sx={{ color: '#90A4AE' }} />}
              label="😐"
            />
            <FormControlLabel
              value="sad"
              control={<Radio sx={{ color: '#4FC3F7' }} />}
              label="😞"
            />
          </RadioGroup>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            fullWidth
            disabled={!text.trim() || text.length > maxChars}
          >
            Submit Journal
          </Button>
        </form>
      </Box>
      </motion.div>
    </Container>
  );
};

export default AddJournal;
