import React, { useEffect, useState } from 'react';
import {
  Typography,
  Container,
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  useMediaQuery,
  Button,
  Pagination,
  IconButton,
  TextField,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Snackbar, 
  Alert
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth0 } from '@auth0/auth0-react';
import CalendarMoodHeatmap, { HeatmapData } from '../components/CalendarHeatmap';
import axios from '../api/axios';
import {motion} from 'framer-motion'

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type SentimentLabel = 'positive' | 'neutral' | 'negative';

interface Entry {
  _id: string;
  text: string;
  selectedMood: 'happy' | 'neutral' | 'sad';
  sentimentLabel: SentimentLabel;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const { user, getAccessTokenSilently } = useAuth0();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [range, setRange] = useState<'3' | '6' | '12'>('3');

  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 5;


  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<Entry | null>(null);
  const [editText, setEditText] = useState('');
  const [editMood, setEditMood] = useState<'happy' | 'neutral' | 'sad'>('happy');
  const [successMsg, setSuccessMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  const apiUrl = process.env.REACT_APP_API_URL!;

  const moodEmojiMap = {
    happy: '😊',
    neutral: '😐',
    sad: '😞',
  };

  const sentimentColorMap: Record<SentimentLabel, string> = {
  positive: '#2e7d32', // green
  neutral: '#616161',  // gray
  negative: '#c62828', // red
};

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = await getAccessTokenSilently({
        audience: apiUrl,
      } as any);
      // console.log("🔐 Getting token...");
      // console.log("🔐 Access Token:", token);
        const response = await axios.get('/journal', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const journalEntries = response.data;

        const formatted = journalEntries.map((entry: any) => ({
          date: entry.createdAt.split('T')[0],
          count: 1,
          mood: entry.selectedMood,
        }));

        setHeatmapData(formatted);
        setEntries(journalEntries);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [getAccessTokenSilently,apiUrl]);


  const handleEdit = (entry: Entry) => {
    setEditEntry(entry);
    setEditText(entry.text);
    setEditMood(entry.selectedMood);
    setEditDialogOpen(true);
  };

  const handleUpdate = async () => {
    if (!editEntry) return;
    try {
      const token = await getAccessTokenSilently({ audience: apiUrl } as any);
      await axios.put(`/journal/${editEntry._id}`, {
        text: editText,
        selectedMood: editMood,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditDialogOpen(false);
      setEditEntry(null);
      setEditText('');
      setEditMood('happy');
      // Refresh the list
      setLoading(true);
      
      const response = await axios.get('/journal', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(response.data);

      const updatedHeatmap = response.data.map((entry: Entry) => ({
        date: entry.createdAt.split('T')[0],
        count: 1,
        mood: entry.selectedMood,
      }));
      setHeatmapData(updatedHeatmap);

    } catch (err) {
      console.error('Edit error:', err);
    } finally {
      setSuccessMsg('Journal entry updated!');
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const confirmDelete = (entryId: string) => {
    setEntryToDelete(entryId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
  if (!entryToDelete) return;

  try {
    const token = await getAccessTokenSilently({
      audience: apiUrl,
    } as any);

    await axios.delete(`/journal/${entryToDelete}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setEntries((prev) => {
      const updatedEntries = prev.filter((e) => e._id !== entryToDelete);

      const updatedHeatmap = updatedEntries.map((entry) => ({
        date: entry.createdAt.split('T')[0],
        count: 1,
        mood: entry.selectedMood,
      }));

      setHeatmapData(updatedHeatmap);

      return updatedEntries;
    });

    setDeleteConfirmOpen(false);
    setEntryToDelete(null);

  } catch (err) {
    console.error("❌ Failed to delete:", err);
  }
};


  return (
    <Container maxWidth="md">
      <Box mt={6} mb={3} textAlign="center">
        <Typography variant={isMobile ? "h5" : "h4"} fontWeight={500}>
          Welcome, {user?.name || user?.email}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center"><CircularProgress /></Box>
      ) : entries.length === 0 ? (
        <Typography align="center">No journal entries yet.</Typography>
      ) : (
        <List component="div">
            {entries
            .slice((currentPage - 1) * entriesPerPage, currentPage * entriesPerPage)
            .map((entry) => (
              <>
            <motion.div
              key={entry._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >

            <ListItem
              key={entry._id}
              divider
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                backgroundColor: theme.palette.background.paper,
                boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                flexDirection: 'column',
                alignItems: 'flex-start',
              }}
            >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" width="100%">
            <ListItemText
                primary={
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="body1">{entry.text}</Typography>
                    {/* <Typography variant="body1">{moodEmojiMap[entry.selectedMood]}</Typography> */}
                  </Box>
                }
                secondary={
                  <>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Typography
                        variant="caption"
                        sx={{
                          px: 1,
                          py: 0.3,
                          borderRadius: 1,
                          backgroundColor:
                            sentimentColorMap[entry.sentimentLabel],
                          fontWeight: 500,
                        }}
                      >
                        {moodEmojiMap[entry.selectedMood]} {entry.sentimentLabel}
                      </Typography>
                      <Typography variant="caption" color="gray">
                        {new Date(entry.createdAt).toLocaleDateString('en-GB')}
                      </Typography>
                    </Box>
                  </>
                }
              />


              <Box display="flex" alignItems="center" gap={1}>
                <IconButton onClick={() => handleEdit(entry)} size="small">
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => confirmDelete(entry._id)} size="small">
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
              </Box>
          </ListItem>
          </motion.div>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="success" onClose={() => setSnackbarOpen(false)} sx={{ width: '100%' }}>
              {successMsg}
            </Alert>
          </Snackbar>
          </>
          ))}
          
        </List>
      )}

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={Math.ceil(entries.length / entriesPerPage)}
          page={currentPage}
          onChange={(_, value) => setCurrentPage(value)}
          color="primary"
          shape="rounded"
          siblingCount={0}
          boundaryCount={1}
        />
      </Box>

      <Box mt={5}>
        <Typography align="center" variant="h6" gutterBottom>Mood Heatmap</Typography>

      <Box display="flex" gap={1} mb={2} justifyContent="center" flexWrap="wrap">
        {['3', '6', '12'].map((val) => (
          <Button
            key={val}
            onClick={() => setRange(val as '3' | '6' | '12')}
            variant={range === val ? 'contained' : 'outlined'}
            color="primary"
            size="small"
          >
            {val} Months
          </Button>
        ))}
      </Box>

        <Box sx={{ overflowX: 'auto' }}>
          <Box mt={2} display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={16} height={16} borderRadius={2} sx={{ backgroundColor: '#66bb6a' }} />
              <Typography variant="caption">Happy</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={16} height={16} borderRadius={2} sx={{ backgroundColor: '#ffa726' }} />
              <Typography variant="caption">Neutral</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1}>
              <Box width={16} height={16} borderRadius={2} sx={{ backgroundColor: '#ef5350' }} />
              <Typography variant="caption">Sad</Typography>
            </Box>
          </Box>
          <CalendarMoodHeatmap
            data={heatmapData}
            onDateClick={handleDateClick}
            startDate={new Date(new Date().setMonth(new Date().getMonth() - parseInt(range)))}
          />
          
        </Box>
      </Box>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
        <DialogTitle>Edit Journal Entry</DialogTitle>
        <DialogContent>
          <TextField
            label="Journal Text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
          <FormLabel component="legend">Mood</FormLabel>
          <RadioGroup
            row
            value={editMood}
            onChange={(e) => setEditMood(e.target.value as 'happy' | 'neutral' | 'sad')}
          >
            <FormControlLabel value="happy" control={<Radio />} label="😊" />
            <FormControlLabel value="neutral" control={<Radio />} label="😐" />
            <FormControlLabel value="sad" control={<Radio />} label="😞" />
          </RadioGroup>
          <Box mt={2} textAlign="right">
            <Button onClick={() => setEditDialogOpen(false)} sx={{ mr: 1 }}>Cancel</Button>
            <Button onClick={handleUpdate} variant="contained">Update</Button>
          </Box>
        </DialogContent>
      </Dialog>



      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this journal entry?</Typography>
          <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button color="error" onClick={handleConfirmDelete} variant="contained">
              Delete
            </Button>
          </Box>
        </DialogContent>
      </Dialog>


      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Journal for {selectedDate && new Date(selectedDate).toLocaleDateString('en-GB')}</DialogTitle>
        <DialogContent>
          {entries
            .filter(e => e.createdAt.split('T')[0] === selectedDate)
            .map((entry, idx) => (
              <Box key={idx} mb={2} p={1} borderRadius={1} sx= {{backgroundColor:theme.palette.background.paper, boxShadow: '0 2px 6px rgba(0,0,0,0.4)',}} >
                <Typography variant="body1" gutterBottom>
                  {entry.text}
                </Typography>
                <Typography variant="caption" sx={{ display: 'flex', gap: 1 }}>
                  Mood: {moodEmojiMap[entry.selectedMood]} | Sentiment: {entry.sentimentLabel}
                </Typography>
              </Box>
            ))}
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Dashboard;
