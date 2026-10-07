import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  Award,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { api } from '../../services/api';

export const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');

  // Admit Student Modal
  const [admitModalOpen, setAdmitModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNo: '',
    department: 'Computer Science & Engineering',
    semester: 7,
    section: 'A',
    cgpa: 8.5,
    attendancePercent: 92.0,
    phone: '+91 98000 11223',
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/students');
      if (res && res.data) {
        setStudents(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch student registry from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAdmitStudent = async (e) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.rollNo || !newStudent.email) return;

    try {
      await api.post('/students', newStudent);
      setAdmitModalOpen(false);
      setNewStudent({
        name: '',
        email: '',
        rollNo: '',
        department: 'Computer Science & Engineering',
        semester: 7,
        section: 'A',
        cgpa: 8.5,
        attendancePercent: 92.0,
        phone: '+91 98000 11223',
      });
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Error admitting student');
    }
  };

  const handleDeleteStudent = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete student record for ${name}?`)) return;
    try {
      await api.delete(`/students/${id}`);
      fetchStudents();
    } catch (err) {
      alert(err.message || 'Error deleting student record');
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    const matchesRisk = riskFilter === 'All' || s.riskStatus === riskFilter;

    return matchesSearch && matchesDept && matchesRisk;
  });

  const avgCGPA = students.length
    ? (students.reduce((acc, s) => acc + (s.cgpa || 0), 0) / students.length).toFixed(2)
    : '0.00';

  const avgAttendance = students.length
    ? (students.reduce((acc, s) => acc + (s.attendancePercent || 0), 0) / students.length).toFixed(1)
    : '0.0';

  const riskCount = students.filter((s) => s.riskStatus && s.riskStatus.includes('Risk')).length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <Users size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Institutional Student Registry
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Comprehensive directory of all enrolled scholars, academic standings, and attendance compliance.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="contained"
            startIcon={<UserPlus size={18} />}
            onClick={() => setAdmitModalOpen(true)}
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
            Admit New Student
          </Button>
        </Box>
      </Box>

      {/* KPI Counters */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Enrolled Scholars</Typography>
                <Users size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{students.length}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Active in Database</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Average Batch CGPA</Typography>
                <Award size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{avgCGPA}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Out of 10.0 scale</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Batch Attendance</Typography>
                <CheckCircle size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{avgAttendance}%</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Above statutory 75% limit</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Attendance Risk Flags</Typography>
                <AlertTriangle size={20} color="#EF4444" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: riskCount > 0 ? '#EF4444' : '#10B981' }}>
                {riskCount}
              </Typography>
              <Typography variant="caption" sx={{ color: riskCount > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                {riskCount > 0 ? 'Action required (<75%)' : 'All clear'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              size="small"
              placeholder="Search by student name, roll number, or university email..."
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
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Department</InputLabel>
              <Select value={deptFilter} label="Department" onChange={(e) => setDeptFilter(e.target.value)}>
                <MenuItem value="All">All Departments</MenuItem>
                <MenuItem value="Computer Science & Engineering">Computer Science</MenuItem>
                <MenuItem value="Information Technology">Information Technology</MenuItem>
                <MenuItem value="Electronics & Communication">Electronics & Comm</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={riskFilter} label="Status" onChange={(e) => setRiskFilter(e.target.value)}>
                <MenuItem value="All">All Statuses</MenuItem>
                <MenuItem value="Normal">Normal Standing</MenuItem>
                <MenuItem value="High Risk">High Risk (&lt;75%)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
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

      {/* Student Registry Table */}
      {!loading && !error && (
        <TableContainer component={Card} sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Roll Number</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Department</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Sem / Sec</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>CGPA</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Attendance</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4, color: '#94A3B8' }}>
                    No matching student records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((s) => {
                  const isRisk = (s.attendancePercent || 0) < 75;
                  return (
                    <TableRow key={s._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Chip
                          label={s.rollNo}
                          size="small"
                          sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 800, borderRadius: 1.5 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                          {s.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          {s.email}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500 }}>
                          {s.department}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: '#475569' }}>
                          Sem {s.semester} • Sec {s.section}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={`${s.cgpa} CGPA`}
                          size="small"
                          sx={{
                            bgcolor: s.cgpa >= 8.5 ? '#ECFDF5' : '#F8FAFC',
                            color: s.cgpa >= 8.5 ? '#059669' : '#334155',
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,
                            color: isRisk ? '#DC2626' : '#16A34A',
                          }}
                        >
                          {s.attendancePercent}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={s.riskStatus || 'Normal'}
                          size="small"
                          sx={{
                            bgcolor: isRisk ? '#FEF2F2' : '#F0FDF4',
                            color: isRisk ? '#DC2626' : '#16A34A',
                            fontWeight: 700,
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteStudent(s._id, s.name)}
                          sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Admit Student Modal */}
      <Dialog open={admitModalOpen} onClose={() => setAdmitModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Admit / Register New Student</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleAdmitStudent} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              size="small"
              value={newStudent.name}
              onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Roll Number (e.g. 2026-CSE-107)"
                  required
                  fullWidth
                  size="small"
                  value={newStudent.rollNo}
                  onChange={(e) => setNewStudent({ ...newStudent, rollNo: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="University Email"
                  required
                  fullWidth
                  size="small"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
              </Grid>
            </Grid>
            <FormControl size="small" fullWidth>
              <InputLabel>Department</InputLabel>
              <Select
                value={newStudent.department}
                label="Department"
                onChange={(e) => setNewStudent({ ...newStudent, department: e.target.value })}
              >
                <MenuItem value="Computer Science & Engineering">Computer Science & Engineering</MenuItem>
                <MenuItem value="Information Technology">Information Technology</MenuItem>
                <MenuItem value="Electronics & Communication">Electronics & Communication</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Semester"
                  type="number"
                  fullWidth
                  size="small"
                  value={newStudent.semester}
                  onChange={(e) => setNewStudent({ ...newStudent, semester: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Section (e.g. A, B)"
                  fullWidth
                  size="small"
                  value={newStudent.section}
                  onChange={(e) => setNewStudent({ ...newStudent, section: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Current CGPA"
                  type="number"
                  step="0.01"
                  fullWidth
                  size="small"
                  value={newStudent.cgpa}
                  onChange={(e) => setNewStudent({ ...newStudent, cgpa: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Attendance Percentage"
                  type="number"
                  fullWidth
                  size="small"
                  value={newStudent.attendancePercent}
                  onChange={(e) => setNewStudent({ ...newStudent, attendancePercent: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              label="Contact Phone"
              fullWidth
              size="small"
              value={newStudent.phone}
              onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAdmitModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAdmitStudent}
            variant="contained"
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Admit to Registry (MongoDB)
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentsPage;
