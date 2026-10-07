import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  MessageSquare,
  Plus,
  Bell,
  Clock,
  Send,
  Radio,
} from 'lucide-react';
import { api } from '../../services/api';

export const CommunicationPage = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);

  const [newNotice, setNewNotice] = useState({
    title: '',
    content: '',
    category: 'General',
    author: 'Academic Directorate',
    targetRoles: ['ALL'],
    priority: 'Normal',
  });

  const fetchNotices = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/notices');
      if (res?.data) {
        setNotices(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load notices from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleBroadcastNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.content) return;
    try {
      await api.post('/notices', newNotice);
      setBroadcastModalOpen(false);
      setNewNotice({
        title: '',
        content: '',
        category: 'General',
        author: 'Academic Directorate',
        targetRoles: ['ALL'],
        priority: 'Normal',
      });
      fetchNotices();
    } catch (err) {
      alert(err.message || 'Failed to broadcast announcement');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <MessageSquare size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Campus Notice Board &amp; Communication
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Official institutional circulars, academic notifications, and multi-channel role broadcasts.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setBroadcastModalOpen(true)}
          sx={{
            bgcolor: '#1E6BFF',
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 2.5,
            px: 2.5,
            boxShadow: '0 4px 14px rgba(30, 107, 255, 0.3)',
            '&:hover': { bgcolor: '#174ED8' },
          }}
        >
          Broadcast Announcement
        </Button>
      </Box>

      {/* Loading & Errors */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress sx={{ color: '#1E6BFF' }} />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {/* Notices Feed */}
      {!loading && !error && (
        <Grid container spacing={2.5}>
          {notices.map((notice) => {
            const isUrgent = notice.priority === 'Urgent';
            const isHigh = notice.priority === 'High';

            return (
              <Grid item xs={12} key={notice._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #E5EBF5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 8px 24px rgba(30, 107, 255, 0.08)',
                      borderColor: '#BFDBFE',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                          label={notice.category || 'Institutional'}
                          sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 800, borderRadius: 1.5 }}
                        />
                        <Chip
                          label={notice.priority || 'Normal'}
                          size="small"
                          sx={{
                            bgcolor: isUrgent ? '#FEF2F2' : isHigh ? '#FFFBEB' : '#F1F5F9',
                            color: isUrgent ? '#DC2626' : isHigh ? '#B45309' : '#475569',
                            fontWeight: 700,
                          }}
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#64748B', fontSize: '0.8rem' }}>
                        <Clock size={14} />
                        <span>{new Date(notice.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                      {notice.title}
                    </Typography>

                    <Typography variant="body1" sx={{ color: '#475569', mb: 2.5, lineHeight: 1.6 }}>
                      {notice.content}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        Issued by: <strong>{notice.author || 'Office of the Registrar'}</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.8 }}>
                        {notice.targetRoles?.map((r) => (
                          <Chip key={r} label={`Audience: ${r}`} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                        ))}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Broadcast Modal */}
      <Dialog open={broadcastModalOpen} onClose={() => setBroadcastModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Broadcast Institutional Circular</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleBroadcastNotice} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Circular Title"
              required
              fullWidth
              size="small"
              value={newNotice.title}
              onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={newNotice.category}
                    label="Category"
                    onChange={(e) => setNewNotice({ ...newNotice, category: e.target.value })}
                  >
                    <MenuItem value="Institutional">Institutional</MenuItem>
                    <MenuItem value="Examination">Examination</MenuItem>
                    <MenuItem value="Placement">Placement</MenuItem>
                    <MenuItem value="Events">Events</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={newNotice.priority}
                    label="Priority"
                    onChange={(e) => setNewNotice({ ...newNotice, priority: e.target.value })}
                  >
                    <MenuItem value="Normal">Normal</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                    <MenuItem value="Urgent">Urgent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField
              label="Announcement Content"
              required
              fullWidth
              multiline
              rows={4}
              size="small"
              value={newNotice.content}
              onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
            />
            <TextField
              label="Issuing Authority"
              fullWidth
              size="small"
              value={newNotice.author}
              onChange={(e) => setNewNotice({ ...newNotice, author: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setBroadcastModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleBroadcastNotice}
            variant="contained"
            startIcon={<Send size={16} />}
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Broadcast to MongoDB
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunicationPage;
