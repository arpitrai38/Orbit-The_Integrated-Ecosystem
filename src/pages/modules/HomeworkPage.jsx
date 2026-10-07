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
import {
  FileText,
  Clock,
  CheckCircle2,
  UploadCloud,
  FileCode,
  Send,
} from 'lucide-react';
import { api } from '../../services/api';

export const HomeworkPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/assignments');
      if (res?.data) {
        setTasks(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load homework tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmitHomework = (e) => {
    e.preventDefault();
    if (!selectedTask) return;
    setSuccessMsg(`Homework solution submitted successfully for ${selectedTask.title}!`);
    setSubmitModalOpen(false);
    setSubmissionNotes('');
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <FileText size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Homework &amp; Practical Problem Sets
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Weekly problem sheets, programming assignments, and capstone checkpoints.
          </Typography>
        </Box>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

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

      {/* Homework Cards */}
      {!loading && !error && (
        <Grid container spacing={2.5}>
          {tasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            return (
              <Grid item xs={12} md={6} key={task._id}>
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
                      <Chip
                        label={task.courseCode}
                        sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 800, borderRadius: 1.5 }}
                      />
                      <Chip
                        label={isCompleted ? 'Submitted' : 'Pending Action'}
                        size="small"
                        sx={{
                          bgcolor: isCompleted ? '#DCFCE7' : '#FEF3C7',
                          color: isCompleted ? '#166534' : '#92400E',
                          fontWeight: 700,
                        }}
                      />
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                      {task.title}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                      {task.description || 'Complete the exercises and upload written report.'}
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#475569', fontSize: '0.8rem' }}>
                        <Clock size={15} color="#F59E0B" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#475569', fontSize: '0.8rem' }}>
                        <FileCode size={15} color="#1E6BFF" />
                        <span>Weightage: {task.totalMarks} Marks</span>
                      </Box>
                    </Box>

                    <Button
                      variant={isCompleted ? 'outlined' : 'contained'}
                      fullWidth
                      startIcon={isCompleted ? <CheckCircle2 size={16} /> : <UploadCloud size={16} />}
                      onClick={() => {
                        setSelectedTask(task);
                        setSubmitModalOpen(true);
                      }}
                      sx={{
                        textTransform: 'none',
                        fontWeight: 700,
                        borderRadius: 2,
                        py: 1,
                        bgcolor: isCompleted ? 'transparent' : '#1E6BFF',
                        '&:hover': { bgcolor: isCompleted ? '#F8FAFC' : '#174ED8' },
                      }}
                    >
                      {isCompleted ? 'View Submitted File' : 'Submit Homework'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Submit Homework Modal */}
      <Dialog open={submitModalOpen} onClose={() => setSubmitModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Submit Homework: {selectedTask?.title}</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSubmitHomework} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box
              sx={{
                p: 3,
                border: '2px dashed #93C5FD',
                borderRadius: 2.5,
                textAlign: 'center',
                bgcolor: '#EFF6FF',
                cursor: 'pointer',
              }}
            >
              <UploadCloud size={36} color="#1E6BFF" style={{ marginBottom: 8 }} />
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#1E6BFF' }}>
                Click to attach solution PDF or GitHub Repo ZIP
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>
                Supports .pdf, .zip, .tar.gz (Max 25MB)
              </Typography>
            </Box>

            <TextField
              label="Student Notes / Implementation Remarks"
              multiline
              rows={3}
              fullWidth
              size="small"
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Added Dockerfile and unit tests for cloud service mesh..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setSubmitModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitHomework}
            variant="contained"
            startIcon={<Send size={16} />}
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Confirm Submission
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomeworkPage;
