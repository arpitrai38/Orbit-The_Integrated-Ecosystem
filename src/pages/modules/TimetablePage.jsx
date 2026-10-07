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
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  Calendar,
  Plus,
  Clock,
  MapPin,
  User,
  Trash2,
  CalendarDays,
  CalendarCheck,
} from 'lucide-react';
import { api } from '../../services/api';
import { SchoolCalendarChart } from '../../components/dashboard/SchoolCalendarChart';

const DAYS = ['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const TimetablePage = () => {
  const [mainView, setMainView] = useState('calendar'); // 'calendar' | 'routine'
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeDay, setActiveDay] = useState('Monday');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newPeriod, setNewPeriod] = useState({
    day: 'Monday',
    startTime: '09:30 AM',
    endTime: '10:30 AM',
    courseCode: 'CS-401',
    courseName: 'Distributed Systems & Cloud Computing',
    facultyName: 'Prof. Ria Sharma',
    room: 'Room 205',
    department: 'Computer Science & Engineering',
    semester: 7,
  });

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/timetable');
      if (res?.data) {
        setSchedule(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load schedule from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  const handleAddPeriod = async (e) => {
    e.preventDefault();
    try {
      await api.post('/timetable', newPeriod);
      setAddModalOpen(false);
      fetchSchedule();
    } catch (err) {
      alert(err.message || 'Error adding class period');
    }
  };

  const handleDeletePeriod = async (id) => {
    if (!window.confirm('Delete this period from weekly timetable?')) return;
    try {
      await api.delete(`/timetable/${id}`);
      fetchSchedule();
    } catch (err) {
      alert(err.message || 'Error removing period');
    }
  };

  const filteredPeriods = schedule.filter((p) =>
    activeDay === 'All' ? true : p.day === activeDay
  );

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <Calendar size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Weekly Academic Routine &amp; Timetable
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Lecture schedule, room allocations, faculty allocations, and lab session timetable.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setAddModalOpen(true)}
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
          Add Class Period
        </Button>
      </Box>

      {/* View Switcher: Monthly Calendar vs Weekly Routine */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
        <Button
          variant={mainView === 'calendar' ? 'contained' : 'outlined'}
          onClick={() => setMainView('calendar')}
          startIcon={<CalendarDays size={18} />}
          sx={{
            borderRadius: 2.5,
            px: 2.2,
            py: 0.9,
            fontWeight: 800,
            fontSize: '0.85rem',
            textTransform: 'none',
            bgcolor: mainView === 'calendar' ? '#1E6BFF' : 'transparent',
            boxShadow: mainView === 'calendar' ? '0 4px 12px rgba(30,107,255,0.25)' : 'none',
          }}
        >
          Monthly Academic Calendar (Day &amp; Date Grid)
        </Button>
        <Button
          variant={mainView === 'routine' ? 'contained' : 'outlined'}
          onClick={() => setMainView('routine')}
          startIcon={<Clock size={18} />}
          sx={{
            borderRadius: 2.5,
            px: 2.2,
            py: 0.9,
            fontWeight: 800,
            fontSize: '0.85rem',
            textTransform: 'none',
            bgcolor: mainView === 'routine' ? '#1E6BFF' : 'transparent',
            boxShadow: mainView === 'routine' ? '0 4px 12px rgba(30,107,255,0.25)' : 'none',
          }}
        >
          Weekly Period Routine
        </Button>
      </Box>

      {/* Main View Content */}
      {mainView === 'calendar' ? (
        <SchoolCalendarChart title="Campus Academic Calendar &amp; Schedule" />
      ) : (
        <>
          {/* Day Selector Tabs */}
          <Card sx={{ mb: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <Tabs
              value={activeDay}
              onChange={(_, val) => setActiveDay(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                px: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  minHeight: 52,
                  color: '#64748B',
                  '&.Mui-selected': { color: '#1E6BFF' },
                },
                '& .MuiTabs-indicator': {
                  bgcolor: '#1E6BFF',
                  height: 3,
                  borderRadius: '3px 3px 0 0',
                },
              }}
            >
              {DAYS.map((day) => (
                <Tab key={day} label={day} value={day} />
              ))}
            </Tabs>
          </Card>

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

      {/* Schedule Period Cards */}
      {!loading && !error && (
        <Grid container spacing={2.5}>
          {filteredPeriods.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed #CBD5E1' }}>
                <CalendarDays size={36} color="#94A3B8" style={{ marginBottom: 8 }} />
                <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 600 }}>
                  No lecture slots scheduled for {activeDay}.
                </Typography>
              </Card>
            </Grid>
          ) : (
            filteredPeriods.map((period) => (
              <Grid item xs={12} md={6} lg={4} key={period._id}>
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
                  <CardContent sx={{ p: 2.5 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Chip
                        icon={<Clock size={14} color="#1E6BFF" />}
                        label={`${period.startTime} - ${period.endTime}`}
                        sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 800, fontSize: '0.8rem' }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Chip label={period.day} size="small" sx={{ bgcolor: '#F1F5F9', fontWeight: 600 }} />
                        <IconButton
                          size="small"
                          onClick={() => handleDeletePeriod(period._id)}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      </Box>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                      {period.courseName}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip label={period.courseCode} size="small" sx={{ bgcolor: '#F8FAFC', fontWeight: 700, color: '#334155' }} />
                      <Chip label={`Sem ${period.semester}`} size="small" variant="outlined" sx={{ borderColor: '#E2E8F0' }} />
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, pt: 1.5, borderTop: '1px solid #F1F5F9' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569', fontSize: '0.825rem' }}>
                        <User size={15} color="#1E6BFF" />
                        <span>Faculty: <strong>{period.facultyName}</strong></span>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#475569', fontSize: '0.825rem' }}>
                        <MapPin size={15} color="#10B981" />
                        <span>Venue: <strong>{period.room}</strong></span>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
      </>
      )}

      {/* Add Period Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Schedule New Lecture Period</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleAddPeriod} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <FormControl size="small" fullWidth>
              <InputLabel>Day of Week</InputLabel>
              <Select
                value={newPeriod.day}
                label="Day of Week"
                onChange={(e) => setNewPeriod({ ...newPeriod, day: e.target.value })}
              >
                {DAYS.filter((d) => d !== 'All').map((d) => (
                  <MenuItem key={d} value={d}>{d}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Time (e.g. 09:30 AM)"
                  size="small"
                  fullWidth
                  value={newPeriod.startTime}
                  onChange={(e) => setNewPeriod({ ...newPeriod, startTime: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Time (e.g. 10:30 AM)"
                  size="small"
                  fullWidth
                  value={newPeriod.endTime}
                  onChange={(e) => setNewPeriod({ ...newPeriod, endTime: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Course Code"
                  size="small"
                  fullWidth
                  value={newPeriod.courseCode}
                  onChange={(e) => setNewPeriod({ ...newPeriod, courseCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Course Name"
                  size="small"
                  fullWidth
                  value={newPeriod.courseName}
                  onChange={(e) => setNewPeriod({ ...newPeriod, courseName: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Assigned Faculty"
                  size="small"
                  fullWidth
                  value={newPeriod.facultyName}
                  onChange={(e) => setNewPeriod({ ...newPeriod, facultyName: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Classroom / Lab Venue"
                  size="small"
                  fullWidth
                  value={newPeriod.room}
                  onChange={(e) => setNewPeriod({ ...newPeriod, room: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPeriod}
            variant="contained"
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Save to MongoDB
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TimetablePage;
