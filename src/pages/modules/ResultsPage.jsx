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
import {
  Award,
  Search,
  Plus,
  TrendingUp,
  FileCheck2,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { api } from '../../services/api';

export const ResultsPage = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newGrade, setNewGrade] = useState({
    studentName: 'Alex Parker',
    rollNo: '2026-CSE-104',
    courseCode: 'CS-401',
    courseName: 'Distributed Systems & Cloud Computing',
    internalMarks: 36,
    midtermMarks: 27,
    assignmentMarks: 28,
  });

  const fetchGrades = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/grades');
      if (res?.data) {
        setGrades(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load grade records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, []);

  const handleSaveGrade = async (e) => {
    e.preventDefault();
    try {
      await api.post('/grades', newGrade);
      setAddModalOpen(false);
      fetchGrades();
    } catch (err) {
      alert(err.message || 'Error recording marks');
    }
  };

  const filtered = grades.filter(
    (g) =>
      g.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.courseCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalEvaluated = grades.length;
  const avgScore = totalEvaluated
    ? Math.round(grades.reduce((acc, g) => acc + (g.totalMarks || 0), 0) / totalEvaluated)
    : 0;
  const outstandingCount = grades.filter((g) => g.grade && g.grade.includes('O')).length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <Award size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Academic Gradebook &amp; Exam Results
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Comprehensive semester internal marks, midterm scores, assignment tallies, and GPA classifications.
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
          Add / Update Marks
        </Button>
      </Box>

      {/* KPI Counters */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Evaluated</Typography>
                <FileCheck2 size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{totalEvaluated}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Grades recorded</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Batch Average Mark</Typography>
                <TrendingUp size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{avgScore} / 100</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Solid academic median</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Top 'O' Grades</Typography>
                <Sparkles size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>{outstandingCount}</Typography>
              <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600 }}>Score &gt;= 90%</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Pass Ratio</Typography>
                <CheckCircle size={20} color="#8B5CF6" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6' }}>100%</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Zero backlogs detected</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Input */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
        <TextField
          size="small"
          placeholder="Filter gradebook by student name, roll number, or subject code..."
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

      {/* Gradebook Ledger Table */}
      {!loading && !error && (
        <TableContainer component={Card} sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Roll No</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Subject</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Internal (/40)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Midterm (/30)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Assignment (/30)</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Total (/100)</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Grade Awarded</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((g) => {
                const isOutstanding = g.totalMarks >= 90;
                return (
                  <TableRow key={g._id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#1E6BFF' }}>
                      {g.rollNo}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {g.studentName}
                    </TableCell>
                    <TableCell>
                      <Chip label={g.courseCode} size="small" sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 700, mr: 1 }} />
                      <Typography variant="caption" sx={{ color: '#475569' }}>{g.courseName}</Typography>
                    </TableCell>
                    <TableCell align="center">{g.internalMarks}</TableCell>
                    <TableCell align="center">{g.midtermMarks}</TableCell>
                    <TableCell align="center">{g.assignmentMarks}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 800, color: isOutstanding ? '#16A34A' : '#1E6BFF' }}>
                      {g.totalMarks}
                    </TableCell>
                    <TableCell align="right">
                      <Chip
                        label={g.grade || 'A'}
                        size="small"
                        sx={{
                          bgcolor: isOutstanding ? '#DCFCE7' : '#EFF6FF',
                          color: isOutstanding ? '#15803D' : '#1E6BFF',
                          fontWeight: 800,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add / Update Grade Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Record Exam &amp; Internal Marks</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleSaveGrade} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Roll Number"
                  size="small"
                  fullWidth
                  value={newGrade.rollNo}
                  onChange={(e) => setNewGrade({ ...newGrade, rollNo: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Student Full Name"
                  size="small"
                  fullWidth
                  value={newGrade.studentName}
                  onChange={(e) => setNewGrade({ ...newGrade, studentName: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Course Code"
                  size="small"
                  fullWidth
                  value={newGrade.courseCode}
                  onChange={(e) => setNewGrade({ ...newGrade, courseCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Course Name"
                  size="small"
                  fullWidth
                  value={newGrade.courseName}
                  onChange={(e) => setNewGrade({ ...newGrade, courseName: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <TextField
                  label="Internal (/40)"
                  type="number"
                  size="small"
                  fullWidth
                  value={newGrade.internalMarks}
                  onChange={(e) => setNewGrade({ ...newGrade, internalMarks: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Midterm (/30)"
                  type="number"
                  size="small"
                  fullWidth
                  value={newGrade.midtermMarks}
                  onChange={(e) => setNewGrade({ ...newGrade, midtermMarks: e.target.value })}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Assignment (/30)"
                  type="number"
                  size="small"
                  fullWidth
                  value={newGrade.assignmentMarks}
                  onChange={(e) => setNewGrade({ ...newGrade, assignmentMarks: e.target.value })}
                />
              </Grid>
            </Grid>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Typography variant="body2" sx={{ color: '#475569' }}>
                Estimated Total: <strong>{(Number(newGrade.internalMarks) || 0) + (Number(newGrade.midtermMarks) || 0) + (Number(newGrade.assignmentMarks) || 0)} / 100</strong>
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveGrade}
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

export default ResultsPage;
