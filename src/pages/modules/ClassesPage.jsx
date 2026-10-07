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
import Slider from '@mui/material/Slider';
import {
  GraduationCap,
  Search,
  Plus,
  BookOpen,
  Users,
  Clock,
  MapPin,
  TrendingUp,
  Edit,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../../services/api';

export const ClassesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Add Course Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    code: '',
    name: '',
    department: 'Computer Science & Engineering',
    semester: 7,
    credits: 4,
    teacherName: 'Prof. Ria Sharma',
    room: 'Room 205',
    dayTime: 'Mon, Wed 10:00 AM',
  });

  // Progress Update Modal State
  const [progressModalOpen, setProgressModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [newProgress, setNewProgress] = useState(0);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/courses');
      if (res && res.data) {
        setCourses(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load courses from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!newCourse.code || !newCourse.name) return;
    try {
      await api.post('/courses', {
        code: newCourse.code,
        name: newCourse.name,
        department: newCourse.department,
        semester: Number(newCourse.semester),
        credits: Number(newCourse.credits),
        teacherName: newCourse.teacherName,
        schedule: [{ day: newCourse.dayTime, time: '1 hr', room: newCourse.room }],
      });
      setAddModalOpen(false);
      setNewCourse({
        code: '',
        name: '',
        department: 'Computer Science & Engineering',
        semester: 7,
        credits: 4,
        teacherName: 'Prof. Ria Sharma',
        room: 'Room 205',
        dayTime: 'Mon, Wed 10:00 AM',
      });
      fetchCourses();
    } catch (err) {
      alert(err.message || 'Failed to add course');
    }
  };

  const handleUpdateProgress = async () => {
    if (!selectedCourse) return;
    try {
      await api.put(`/courses/${selectedCourse._id}`, {
        syllabusProgress: newProgress,
      });
      setProgressModalOpen(false);
      fetchCourses();
    } catch (err) {
      alert(err.message || 'Failed to update course progress');
    }
  };

  const filtered = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const avgProgress = courses.length
    ? Math.round(courses.reduce((acc, c) => acc + (c.syllabusProgress || 0), 0) / courses.length)
    : 0;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <GraduationCap size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Academic Classes &amp; Coursework
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Comprehensive course offerings, active curricula, syllabus milestones, and instructor assignments.
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
            py: 1,
            boxShadow: '0 4px 14px rgba(30, 107, 255, 0.3)',
            '&:hover': { bgcolor: '#174ED8' },
          }}
        >
          Add New Course
        </Button>
      </Box>

      {/* KPI Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Active Courses</Typography>
                <BookOpen size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{courses.length}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>● Fully Synchronized</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Avg Syllabus Progress</Typography>
                <TrendingUp size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{avgProgress}%</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>On track for term exams</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Students Enrolled</Typography>
                <Users size={20} color="#8B5CF6" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                {courses.reduce((acc, c) => acc + (c.enrolledCount || 0), 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 600 }}>Across 4 active sections</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Semester</Typography>
                <Clock size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>VII (Final)</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Academic Session 2025-26</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Filters */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
        <TextField
          size="small"
          placeholder="Search by course code, title, or instructor name..."
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

      {/* Error / Loading States */}
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

      {/* Course Grid */}
      {!loading && !error && (
        <Grid container spacing={2.5}>
          {filtered.map((course) => (
            <Grid item xs={12} md={6} key={course._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid #E5EBF5',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.02)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 24px rgba(30, 107, 255, 0.08)',
                    borderColor: '#BFDBFE',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip
                        label={course.code}
                        sx={{
                          bgcolor: '#EFF6FF',
                          color: '#1E6BFF',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          borderRadius: 1.5,
                        }}
                      />
                      <Chip
                        label={`${course.credits} Credits`}
                        size="small"
                        sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600 }}
                      />
                    </Box>
                    <Chip
                      label={`Sem ${course.semester}`}
                      size="small"
                      variant="outlined"
                      sx={{ borderColor: '#E2E8F0', color: '#64748B', fontWeight: 600 }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    {course.name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                    Instructor: <strong>{course.teacherName}</strong> • {course.department}
                  </Typography>

                  {/* Schedule Details */}
                  {course.schedule && course.schedule.length > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5, bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#475569', fontSize: '0.8rem' }}>
                        <Clock size={15} color="#1E6BFF" />
                        <span>{course.schedule[0].day} ({course.schedule[0].time})</span>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#475569', fontSize: '0.8rem' }}>
                        <MapPin size={15} color="#10B981" />
                        <span>{course.schedule[0].room}</span>
                      </Box>
                    </Box>
                  )}

                  {/* Progress Bar */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.8 }}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#334155' }}>
                        Syllabus Covered
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: '#1E6BFF' }}>
                        {course.syllabusProgress || 0}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.syllabusProgress || 0}
                      sx={{
                        height: 7,
                        borderRadius: 4,
                        bgcolor: '#E2E8F0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#1E6BFF',
                          borderRadius: 4,
                        },
                      }}
                    />
                  </Box>

                  {/* Card Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1, borderTop: '1px solid #F1F5F9' }}>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      <strong>{course.enrolledCount || 60}</strong> Students Enrolled
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<Edit size={14} />}
                      onClick={() => {
                        setSelectedCourse(course);
                        setNewProgress(course.syllabusProgress || 0);
                        setProgressModalOpen(true);
                      }}
                      sx={{ textTransform: 'none', fontWeight: 600, color: '#1E6BFF' }}
                    >
                      Update Progress
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add Course Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>Add New Academic Course</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleCreateCourse} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Course Code (e.g. CS-409)"
              required
              fullWidth
              size="small"
              value={newCourse.code}
              onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
            />
            <TextField
              label="Course Title"
              required
              fullWidth
              size="small"
              value={newCourse.name}
              onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Credits"
                  type="number"
                  fullWidth
                  size="small"
                  value={newCourse.credits}
                  onChange={(e) => setNewCourse({ ...newCourse, credits: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Semester"
                  type="number"
                  fullWidth
                  size="small"
                  value={newCourse.semester}
                  onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              label="Faculty Instructor"
              fullWidth
              size="small"
              value={newCourse.teacherName}
              onChange={(e) => setNewCourse({ ...newCourse, teacherName: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Lecture Room"
                  fullWidth
                  size="small"
                  value={newCourse.room}
                  onChange={(e) => setNewCourse({ ...newCourse, room: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Day & Time Slot"
                  fullWidth
                  size="small"
                  value={newCourse.dayTime}
                  onChange={(e) => setNewCourse({ ...newCourse, dayTime: e.target.value })}
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
            onClick={handleCreateCourse}
            variant="contained"
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Save to MongoDB
          </Button>
        </DialogActions>
      </Dialog>

      {/* Progress Update Modal */}
      <Dialog open={progressModalOpen} onClose={() => setProgressModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Update Syllabus Progress</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ py: 2 }}>
            <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
              Adjust current syllabus milestone for <strong>{selectedCourse?.name}</strong>:
            </Typography>
            <Box sx={{ px: 2 }}>
              <Slider
                value={newProgress}
                onChange={(_, val) => setNewProgress(val)}
                valueLabelDisplay="on"
                min={0}
                max={100}
                sx={{ color: '#1E6BFF' }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setProgressModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProgress}
            variant="contained"
            startIcon={<CheckCircle2 size={16} />}
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Save Progress
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassesPage;
