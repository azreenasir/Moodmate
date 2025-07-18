import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

interface JournalEntry {
  createdAt: string;
  sentimentLabel: 'positive' | 'negative' | 'neutral';
}

interface ChartData {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
}

const apiUrl = process.env.REACT_APP_API_URL!;

const Analytics: React.FC = () => {
  const { getAccessTokenSilently } = useAuth0();
  

  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  // helper to convert raw entries → chart series
  const groupDataByDate = (entries: JournalEntry[]): ChartData[] => {
    const map = new Map<string, ChartData>();

    entries.forEach((entry) => {
      const date = new Date(entry.createdAt).toISOString().split('T')[0]; // YYYY‑MM‑DD
      if (!map.has(date)) {
        map.set(date, { date, positive: 0, negative: 0, neutral: 0 });
      }
      map.get(date)![entry.sentimentLabel] += 1;
    });

    return Array.from(map.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await getAccessTokenSilently({
          audience: apiUrl,
        } as any); // cast because Auth0 typings don’t include `audience`
        const response = await axios.get('/journal', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setData(groupDataByDate(response.data));
      } catch (err) {
        console.error('Analytics fetch error:', err);
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [getAccessTokenSilently]); // run once when Auth0 hook is ready

  return (
    <Container>
      <Box mt={6} textAlign="center">
        <Typography  variant={isMobile ? "h5" : "h4"} fontWeight={500} gutterBottom>
          Mood Analytics
        </Typography>

        {loading && <CircularProgress />}

        {!loading && error && <Alert severity="error">{error}</Alert>}

        {!loading && !error && data.length === 0 && (
          <Alert severity="info">No journal data available yet.</Alert>
        )}

        {!loading && !error && data.length > 0 && (
         <Box
            sx={{
              overflowX: isMobile ? 'auto' : 'visible',
              display: 'flex', // important to enable centering
              justifyContent: isMobile ? 'center' : 'flex-start',
            }}
            
            mt={4}
          >
            <Box sx={{ minWidth: isMobile ? 350 : '100%' }}>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
                <LineChart data={data}>
                  <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="positive" stroke="#4caf50" />
                  <Line type="monotone" dataKey="neutral" stroke="#ff9800" />
                  <Line type="monotone" dataKey="negative" stroke="#f44336" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Box>

        )}
      </Box>
    </Container>
  );
};

export default Analytics;
