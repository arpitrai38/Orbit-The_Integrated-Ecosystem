import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Slider from '@mui/material/Slider';
import {
  BookOpen,
  Plus,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  Edit3,
} from 'lucide-react';
import { api } from '../../services/api';

export const LessonPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [activePlan, setActivePlan] = useState(null);
  const [progressVal, setProgressVal] = useState(0);

  const [newPlan, setNewPlan] = useState({
    courseCode: 'CS-401',
    courseName: 'Distributed Systems & Cloud Computing',
    unitNumber: 5,
    unitTitle: 'Unit 5: Edge Computing & IoT Cloud Integrations',
    topics: 'Fog architecture, Edge telemetry ingestion, MQTT & CoAP protocols',
    objectives: 'Understand latency-critical computation models at the network edge.',
    teachingMethodology: 'Interactive Seminar & Raspberry Pi Emulation',
    durationHours: 10,
  });

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/lesson-plans');
      if (res?.data) {
        setPlans(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load lesson plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await api.post('/lesson-plans', {
        ...newPlan,
        unitNumber: Number(newPlan.unitNumber),
        durationHours: Number(newPlan.durationHours),
        topics: typeof newPlan.topics === 'string' ? newPlan.topics.split(',').map((t) => t.trim()) : newPlan.topics,
      });
      setAddModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Error creating lesson plan');
    }
  };

  const handleAiAutoFill = () => {
    setNewPlan({
      courseCode: 'CS-401',
      courseName: 'Distributed Systems & Cloud Computing',
      unitNumber: (plans.length + 1) || 5,
      unitTitle: `Unit ${(plans.length + 1) || 5}: AI Workload Acceleration on Cloud Clusters`,
      topics: 'GPU orchestration with Kubernetes, Triton Inference Server, Distributed Tensor Parallelism, NCCL communication',
      objectives: 'Enable students to schedule and scale high-performance ML inference on distributed GPU nodes.',
      teachingMethodology: 'Hands-on Cloud GPU Lab & Model Profiling',
      durationHours: 14,
    });
  };

  const handleSaveProgress = async () => {
    if (!activePlan) return;
    try {
      const status = progressVal === 100 ? 'Completed' : progressVal > 0 ? 'In Progress' : 'Upcoming';
      await api.patch(`/lesson-plans/${activePlan._id}/progress`, {
        progressPercent: progressVal,
        status,
      });
      setUpdateModalOpen(false);
      fetchPlans();
    } catch (err) {
      alert(err.message || 'Failed to update unit progress');
    }
  };

  const completedUnits = plans.filter((p) => p.status === 'Completed').length;
  const inProgressUnits = plans.filter((p) => p.status === 'In Progress').length;
  const avgCompletion = plans.length
    ? Math.round(plans.reduce((acc, p) => acc + (p.progressPercent || 0), 0) / plans.length)
    : 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <BookOpen size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Curriculum Roadmap &amp; Lesson Plans
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Structured pedagogical syllabus breakdown, unit milestones, and AI-assisted lesson blueprints.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
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
            Add Syllabus Unit
          </Button>
        </Box>
      </Box>

      {/* KPI Counters */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Curriculum Units</Typography>
                <Layers size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{plans.length}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Accredited Syllabus</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Completed Units</Typography>
                <CheckCircle2 size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>{completedUnits}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>100% lectures delivered</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Active Units In Flight</Typography>
                <Clock size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>{inProgressUnits}</Typography>
              <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600 }}>Teaching in progress</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Term Completion</Typography>
                <ArrowRight size={20} color="#8B5CF6" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6' }}>{avgCompletion}%</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Mid-term ready</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      {/* Unit Cards List */}
      {!loading && !error && (
        <Grid container spacing={2.5}>
          {plans.map((unit) => {
            const isDone = unit.status === 'Completed';
            const isInProg = unit.status === 'In Progress';
            return (
              <Grid item xs={12} key={unit._id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    border: '1px solid #E5EBF5',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'border-color 0.2s ease',
                    '&:hover': { borderColor: '#BFDBFE' },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Chip
                          label={unit.courseCode}
                          sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 800, borderRadius: 1.5 }}
                        />
                        <Chip
                          label={unit.status}
                          size="small"
                          sx={{
                            bgcolor: isDone ? '#DCFCE7' : isInProg ? '#FEF3C7' : '#F1F5F9',
                            color: isDone ? '#166534' : isInProg ? '#92400E' : '#475569',
                            fontWeight: 700,
                          }}
                        />
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          Duration: <strong>{unit.durationHours} Hours</strong> • {unit.teachingMethodology}
                        </Typography>
                      </Box>

                      <Button
                        size="small"
                        startIcon={<Edit3 size={14} />}
                        onClick={() => {
                          setActivePlan(unit);
                          setProgressVal(unit.progressPercent || 0);
                          setUpdateModalOpen(true);
                        }}
                        sx={{ textTransform: 'none', fontWeight: 600, color: '#1E6BFF' }}
                      >
                        Set Progress
                      </Button>
                    </Box>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                      {unit.unitTitle}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#475569', mb: 2 }}>
                      <strong>Learning Objectives:</strong> {unit.objectives}
                    </Typography>

                    {/* Topics Sub-chips */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5 }}>
                      {unit.topics?.map((topic, i) => (
                        <Chip
                          key={i}
                          label={topic}
                          size="small"
                          sx={{ bgcolor: '#F8FAFC', color: '#334155', border: '1px solid #E2E8F0', fontSize: '0.75rem' }}
                        />
                      ))}
                    </Box>

                    {/* Progress Bar */}
                    <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748B' }}>
                          Unit Teaching Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E6BFF' }}>
                          {unit.progressPercent}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={unit.progressPercent || 0}
                        sx={{
                          height: 7,
                          borderRadius: 4,
                          bgcolor: '#E2E8F0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: isDone ? '#10B981' : '#1E6BFF',
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

      {/* Add Unit Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Add Curriculum Unit Plan</span>
          <Button
            size="small"
            startIcon={<Sparkles size={14} />}
            onClick={handleAiAutoFill}
            sx={{ textTransform: 'none', bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 700, borderRadius: 2 }}
          >
            Orbit AI Auto-Plan
          </Button>
        </DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleCreatePlan} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Course Code"
                  size="small"
                  fullWidth
                  value={newPlan.courseCode}
                  onChange={(e) => setNewPlan({ ...newPlan, courseCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Unit Number"
                  type="number"
                  size="small"
                  fullWidth
                  value={newPlan.unitNumber}
                  onChange={(e) => setNewPlan({ ...newPlan, unitNumber: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              label="Unit Title"
              required
              size="small"
              fullWidth
              value={newPlan.unitTitle}
              onChange={(e) => setNewPlan({ ...newPlan, unitTitle: e.target.value })}
            />
            <TextField
              label="Topics (comma separated)"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={newPlan.topics}
              onChange={(e) => setNewPlan({ ...newPlan, topics: e.target.value })}
            />
            <TextField
              label="Pedagogical Learning Objectives"
              size="small"
              fullWidth
              multiline
              rows={2}
              value={newPlan.objectives}
              onChange={(e) => setNewPlan({ ...newPlan, objectives: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Methodology"
                  size="small"
                  fullWidth
                  value={newPlan.teachingMethodology}
                  onChange={(e) => setNewPlan({ ...newPlan, teachingMethodology: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Duration Hours"
                  type="number"
                  size="small"
                  fullWidth
                  value={newPlan.durationHours}
                  onChange={(e) => setNewPlan({ ...newPlan, durationHours: e.target.value })}
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
            onClick={handleCreatePlan}
            variant="contained"
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Save Unit to MongoDB
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Slider Modal */}
      <Dialog open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Update Unit Completion</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
              Set coverage percentage for <strong>{activePlan?.unitTitle}</strong>:
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={progressVal}
                onChange={(_, val) => setProgressVal(val)}
                valueLabelDisplay="on"
                min={0}
                max={100}
                sx={{ color: '#1E6BFF' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUpdateModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveProgress}
            variant="contained"
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Save Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LessonPlansPage;
