import React, { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import { CalendarPlus, Clock, ExternalLink, Radio, Users, Video } from 'lucide-react';
import { api } from '../../services/api';
import { getLoggedInUser } from '../../utils/greeting';

const initialForm = { title: '', courseCode: '', scheduledAt: '', durationMinutes: 60, meetingUrl: '', meetingPlatform: 'Google Meet' };

export const LiveClassesPage = () => {
  const user = getLoggedInUser();
  const canManage = ['ADMIN', 'TEACHER'].includes(user.role);
  const [sessions, setSessions] = useState([]);
  const [notice, setNotice] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    api.get('/live-classes').then((res) => setSessions(res.data || [])).catch(() => setNotice('Live-class records will appear after the server is connected.'));
  }, []);

  const liveCount = useMemo(() => sessions.filter((session) => session.status === 'Live').length, [sessions]);
  const saveClass = async () => {
    if (!form.title || !form.courseCode || !form.scheduledAt) return;
    const session = { ...form, facultyName: user.name || 'Faculty', scheduledAt: new Date(form.scheduledAt).toISOString(), durationMinutes: Number(form.durationMinutes), status: 'Scheduled', attendees: 0 };
    try {
      const result = await api.post('/live-classes', session);
      setSessions((old) => [...old, result.data]);
    } catch { setSessions((old) => [...old, { ...session, _id: `local-${Date.now()}` }]); }
    setOpen(false); setForm(initialForm);
  };
  const updateStatus = async (session, status) => {
    try { const result = await api.patch(`/live-classes/${session._id}`, { status }); setSessions((old) => old.map((item) => item._id === session._id ? result.data : item)); }
    catch { setSessions((old) => old.map((item) => item._id === session._id ? { ...item, status } : item)); }
  };

  return <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: { sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, mb: 3 }}>
      <Box><Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>Live Learning Studio</Typography><Typography variant="body2" color="text.secondary">Run secure live lectures, track participation, and keep recordings in one place.</Typography></Box>
      {canManage && <Button variant="contained" startIcon={<CalendarPlus size={18} />} onClick={() => setOpen(true)} sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}>Schedule class</Button>}
    </Box>
    {notice && <Alert severity="info" sx={{ mb: 2 }}>{notice}</Alert>}
    <Grid container spacing={2.5} sx={{ mb: 3 }}>
      {[[liveCount, 'Classes live now', '#EF4444', Radio], [sessions.filter(s => s.status === 'Scheduled').length, 'Upcoming sessions', '#1E6BFF', Video], [sessions.reduce((sum, s) => sum + (s.attendees || 0), 0), 'Learners engaged', '#10B981', Users]].map(([value, label, color, Icon]) => <Grid item xs={12} sm={4} key={label}><Card sx={{ p: 2.5, border: '1px solid #E5EBF5', borderRadius: 3 }}><Icon size={20} color={color} /><Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>{value}</Typography><Typography variant="body2" color="text.secondary">{label}</Typography></Card></Grid>)}
    </Grid>
    <Grid container spacing={2.5}>{sessions.length === 0 && <Grid item xs={12}><Card sx={{ p: 4, borderRadius: 3, border: '1px dashed #CBD5E1', textAlign: 'center' }}><Typography sx={{ fontWeight: 700 }}>No live classes scheduled</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Faculty can schedule the first live class from this page.</Typography></Card></Grid>}{sessions.map((session) => <Grid item xs={12} md={6} key={session._id}><Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, mb: 2 }}><Chip label={session.status} color={session.status === 'Live' ? 'error' : session.status === 'Completed' ? 'success' : 'primary'} size="small" /><Chip label={session.courseCode} variant="outlined" size="small" /></Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>{session.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .6 }}>{session.facultyName} · {session.meetingPlatform}</Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2, color: '#475569', fontSize: '.85rem' }}><Box sx={{ display: 'flex', gap: .5, alignItems: 'center' }}><Clock size={15}/>{new Date(session.scheduledAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</Box><Box sx={{ display: 'flex', gap: .5, alignItems: 'center' }}><Users size={15}/>{session.attendees} joined</Box></Box>
      <Box sx={{ display: 'flex', gap: 1, mt: 2.5 }}>
        {session.status === 'Live' && <Button variant="contained" startIcon={<ExternalLink size={15}/>} onClick={() => session.meetingUrl ? window.open(session.meetingUrl, '_blank', 'noopener,noreferrer') : setNotice('Meeting link will be added by the faculty before class starts.')} sx={{ textTransform: 'none', bgcolor: '#1E6BFF' }}>Join live</Button>}
        {canManage && session.status === 'Scheduled' && <Button onClick={() => updateStatus(session, 'Live')} sx={{ textTransform: 'none' }}>Start class</Button>}
        {canManage && session.status === 'Live' && <Button color="success" onClick={() => updateStatus(session, 'Completed')} sx={{ textTransform: 'none' }}>End class</Button>}
      </Box>
    </Card></Grid>)}</Grid>
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm"><DialogTitle sx={{ fontWeight: 800 }}>Schedule live class</DialogTitle><DialogContent><Box sx={{ pt: 1, display: 'grid', gap: 2 }}>
      <TextField label="Session title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /><TextField label="Course code" value={form.courseCode} onChange={e => setForm({ ...form, courseCode: e.target.value })} required />
      <TextField label="Date & time" type="datetime-local" InputLabelProps={{ shrink: true }} value={form.scheduledAt} onChange={e => setForm({ ...form, scheduledAt: e.target.value })} required /><TextField label="Meeting link" value={form.meetingUrl} onChange={e => setForm({ ...form, meetingUrl: e.target.value })} />
      <TextField select label="Platform" value={form.meetingPlatform} onChange={e => setForm({ ...form, meetingPlatform: e.target.value })}><MenuItem value="Google Meet">Google Meet</MenuItem><MenuItem value="Microsoft Teams">Microsoft Teams</MenuItem><MenuItem value="Zoom">Zoom</MenuItem></TextField>
    </Box></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained" onClick={saveClass}>Schedule</Button></DialogActions></Dialog>
  </Box>;
};
export default LiveClassesPage;
