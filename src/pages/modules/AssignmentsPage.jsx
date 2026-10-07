import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import {
  FileCheck,
  Search,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';

export const AssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [newAssignment, setNewAssignment] = useState({
    courseCode: 'CS-401',
    courseName: 'Distributed Systems & Cloud Computing',
    title: '',
    description: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    totalMarks: 25,
    totalStudents: 34,
  });

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/assignments');
      if (res?.data) {
        setAssignments(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load assignments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.title) return;
    try {
      await api.post('/assignments', newAssignment);
      setCreateModalOpen(false);
      setNewAssignment({
        courseCode: 'CS-401',
        courseName: 'Distributed Systems & Cloud Computing',
        title: '',
        description: '',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalMarks: 25,
        totalStudents: 34,
      });
      fetchAssignments();
    } catch (err) {
      alert(err.message || 'Failed to create assignment');
    }
  };

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = assignments.filter((a) => a.status === 'Active').length;
  const completedCount = assignments.filter((a) => a.status === 'Completed').length;
  const totalSubmissions = assignments.reduce((acc, a) => acc + (a.submittedCount || 0), 0);

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <FileCheck size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              LMS Assignments &amp; Coursework
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Continuous academic evaluations, homework deadlines, submission metrics, and grading portals.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setCreateModalOpen(true)}
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
          Create New Assignment
        </Button>
      </Box>

      {/* KPI Counters */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Assignments</Typography>
                <FileText size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{assignments.length}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Active in database</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Active Homework</Typography>
                <Clock size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>{activeCount}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Open for submissions</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Turn-ins</Typography>
                <CheckCircle size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>{totalSubmissions}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Submitted by scholars</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Closed / Evaluated</Typography>
                <AlertCircle size={20} color="#8B5CF6" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6' }}>{completedCount}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Graded &amp; archived</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Input */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
        <TextField
          size="small"
          placeholder="Search assignments by title or course code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#94A3B8" />
              </InputAdornment>
            ),
            sx: { borderRadius: 2, bgcolor: '#F8FAFC' },
          }}
        />
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

      {/* Assignments List */}
      {!loading && !error && (
        <Grid container spacing={2.5}>
          {filtered.map((a) => {
            const ratio = a.totalStudents ? Math.round((a.submittedCount / a.totalStudents) * 100) : 0;
            const isCompleted = a.status === 'Completed';

            return (
              <Grid item xs={12} md={6} key={a._id}>
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
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Chip
                          label={a.courseCode}
                          sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 800, borderRadius: 1.5 }}
                        />
                        <Chip
                          label={`${a.totalMarks} Marks`}
                          size="small"
                          sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600 }}
                        />
                      </Box>
                      <Chip
                        label={a.status}
                        size="small"
                        sx={{
                          bgcolor: isCompleted ? '#DCFCE7' : '#EFF6FF',
                          color: isCompleted ? '#166534' : '#1E6BFF',
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                      {a.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#64748B', mb: 2, minHeight: 40 }}>
                      {a.description || 'Deliver project report and source files before due date.'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, color: '#64748B', fontSize: '0.825rem' }}>
                      <Clock size={15} color="#F59E0B" />
                      <span>
                        Due Date: <strong>{new Date(a.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</strong>
                      </span>
                    </Box>

                    {/* Submissions Bar */}
                    <Box sx={{ pt: 1, borderTop: '1px solid #F1F5F9' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                          Submissions Ratio
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#0F172A' }}>
                          {a.submittedCount} / {a.totalStudents} ({ratio}%)
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={ratio}
                        sx={{
                          height: 6,
                          borderRadius: 4,
                          bgcolor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: isCompleted ? '#10B981' : '#1E6BFF',
                            borderRadius: 4,
                          },
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Assignment Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Create New LMS Assignment</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleCreateAssignment} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Course Code"
                  size="small"
                  fullWidth
                  value={newAssignment.courseCode}
                  onChange={(e) => setNewAssignment({ ...newAssignment, courseCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total Marks"
                  type="number"
                  size="small"
                  fullWidth
                  value={newAssignment.totalMarks}
                  onChange={(e) => setNewAssignment({ ...newAssignment, totalMarks: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              label="Assignment Title"
              required
              size="small"
              fullWidth
              value={newAssignment.title}
              onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            />
            <TextField
              label="Detailed Prompt / Instructions"
              size="small"
              fullWidth
              multiline
              rows={3}
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Submission Due Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newAssignment.dueDate}
                  onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Batch Size (Students)"
                  type="number"
                  size="small"
                  fullWidth
                  value={newAssignment.totalStudents}
                  onChange={(e) => setNewAssignment({ ...newAssignment, totalStudents: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateAssignment}
            variant="contained"
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Publish to MongoDB
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssignmentsPage;
