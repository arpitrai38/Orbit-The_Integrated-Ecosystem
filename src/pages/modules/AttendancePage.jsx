import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ButtonGroup from '@mui/material/ButtonGroup';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Save,
  CheckCheck,
} from 'lucide-react';
import { api } from '../../services/api';

export const AttendancePage = () => {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Marking Form State
  const [selectedCourse, setSelectedCourse] = useState('CS-401');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState({}); // { [rollNo]: 'Present' | 'Absent' | 'Late' }

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [coursesRes, studentsRes, logsRes] = await Promise.all([
        api.get('/courses'),
        api.get('/students'),
        api.get('/attendance'),
      ]);

      if (coursesRes?.data) setCourses(coursesRes.data);
      if (studentsRes?.data) {
        setStudents(studentsRes.data);
        // Default everyone to 'Present'
        const initial = {};
        studentsRes.data.forEach((s) => {
          initial[s.rollNo] = 'Present';
        });
        setRecords(initial);
      }
      if (logsRes?.data) setAttendanceLogs(logsRes.data);
    } catch (err) {
      setError(err.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = (rollNo, status) => {
    setRecords((prev) => ({ ...prev, [rollNo]: status }));
  };

  const handleMarkAll = (status) => {
    const updated = {};
    students.forEach((s) => {
      updated[s.rollNo] = status;
    });
    setRecords(updated);
  };

  const handleSaveAttendance = async () => {
    try {
      setSuccessMsg('');
      const formattedRecords = students.map((s) => ({
        rollNo: s.rollNo,
        studentName: s.name,
        status: records[s.rollNo] || 'Present',
      }));

      await api.post('/attendance', {
        courseCode: selectedCourse,
        date: selectedDate,
        markedBy: 'Prof. Ria Sharma',
        records: formattedRecords,
      });

      setSuccessMsg(`Session attendance successfully stored in MongoDB for ${selectedCourse}!`);
      // Refresh logs
      const logsRes = await api.get('/attendance');
      if (logsRes?.data) setAttendanceLogs(logsRes.data);
    } catch (err) {
      alert(err.message || 'Error recording attendance');
    }
  };

  const presentCount = Object.values(records).filter((r) => r === 'Present').length;
  const absentCount = Object.values(records).filter((r) => r === 'Absent').length;
  const lateCount = Object.values(records).filter((r) => r === 'Late').length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <CalendarCheck size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Lecture &amp; Session Attendance
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Real-time biometric &amp; lecture attendance tracking backed by institutional database.
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<CheckCheck size={16} />}
            onClick={() => handleMarkAll('Present')}
            sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2 }}
          >
            Mark All Present
          </Button>
          <Button
            variant="contained"
            startIcon={<Save size={16} />}
            onClick={handleSaveAttendance}
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
            Save to MongoDB
          </Button>
        </Box>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {/* Control Strip & Live Session Counts */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: '#334155' }}>
              Select Course &amp; Date
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <FormControl size="small" fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedCourse}
                  label="Course"
                  onChange={(e) => setSelectedCourse(e.target.value)}
                >
                  {courses.map((c) => (
                    <MenuItem key={c.code} value={c.code}>
                      {c.code} — {c.name}
                    </MenuItem>
                  ))}
                  {courses.length === 0 && <MenuItem value="CS-401">CS-401 — Cloud Computing</MenuItem>}
                </Select>
              </FormControl>

              <TextField
                type="date"
                size="small"
                label="Lecture Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={4} md={2.6}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none', bgcolor: '#F0FDF4' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#166534' }}>PRESENT TODAY</Typography>
              <CheckCircle2 size={18} color="#16A34A" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#166534' }}>{presentCount}</Typography>
            <Typography variant="caption" sx={{ color: '#16A34A' }}>Students accounted</Typography>
          </Card>
        </Grid>

        <Grid item xs={4} md={2.6}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none', bgcolor: '#FEF2F2' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#991B1B' }}>ABSENT TODAY</Typography>
              <XCircle size={18} color="#EF4444" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#991B1B' }}>{absentCount}</Typography>
            <Typography variant="caption" sx={{ color: '#EF4444' }}>Marked absent</Typography>
          </Card>
        </Grid>

        <Grid item xs={4} md={2.8}>
          <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none', bgcolor: '#FFFBEB' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#92400E' }}>LATE ENTRIES</Typography>
              <Clock size={18} color="#F59E0B" />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#92400E' }}>{lateCount}</Typography>
            <Typography variant="caption" sx={{ color: '#F59E0B' }}>Admitted with pass</Typography>
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

      {/* Student Attendance Marking Roster */}
      {!loading && !error && (
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
              <Box sx={{ p: 2.5, pb: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Student Roll Roster — {selectedCourse}
                </Typography>
                <Chip label={`${students.length} Total Enrolled`} size="small" sx={{ fontWeight: 600 }} />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead sx={{ bgcolor: '#F8FAFC' }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Roll No</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student Name</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Term Attendance</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Mark Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {students.map((s) => {
                      const curStatus = records[s.rollNo] || 'Present';
                      return (
                        <TableRow key={s.rollNo} hover>
                          <TableCell sx={{ fontWeight: 700, color: '#1E6BFF' }}>
                            {s.rollNo}
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                              {s.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#64748B' }}>
                              {s.department}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: s.attendancePercent < 75 ? '#EF4444' : '#10B981' }}>
                              {s.attendancePercent}%
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <ButtonGroup size="small">
                              <Button
                                variant={curStatus === 'Present' ? 'contained' : 'outlined'}
                                onClick={() => handleStatusChange(s.rollNo, 'Present')}
                                sx={{
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  bgcolor: curStatus === 'Present' ? '#16A34A' : 'transparent',
                                  borderColor: '#16A34A',
                                  color: curStatus === 'Present' ? '#FFFFFF' : '#16A34A',
                                  '&:hover': { bgcolor: curStatus === 'Present' ? '#15803D' : '#F0FDF4' },
                                }}
                              >
                                Present
                              </Button>
                              <Button
                                variant={curStatus === 'Absent' ? 'contained' : 'outlined'}
                                onClick={() => handleStatusChange(s.rollNo, 'Absent')}
                                sx={{
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  bgcolor: curStatus === 'Absent' ? '#EF4444' : 'transparent',
                                  borderColor: '#EF4444',
                                  color: curStatus === 'Absent' ? '#FFFFFF' : '#EF4444',
                                  '&:hover': { bgcolor: curStatus === 'Absent' ? '#DC2626' : '#FEF2F2' },
                                }}
                              >
                                Absent
                              </Button>
                              <Button
                                variant={curStatus === 'Late' ? 'contained' : 'outlined'}
                                onClick={() => handleStatusChange(s.rollNo, 'Late')}
                                sx={{
                                  textTransform: 'none',
                                  fontSize: '0.75rem',
                                  fontWeight: 700,
                                  bgcolor: curStatus === 'Late' ? '#F59E0B' : 'transparent',
                                  borderColor: '#F59E0B',
                                  color: curStatus === 'Late' ? '#FFFFFF' : '#F59E0B',
                                  '&:hover': { bgcolor: curStatus === 'Late' ? '#D97706' : '#FFFBEB' },
                                }}
                              >
                                Late
                              </Button>
                            </ButtonGroup>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Grid>

          {/* Past Recorded Sessions Log */}
          <Grid item xs={12} lg={4}>
            <Card sx={{ p: 2.5, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                Recent Session History
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {attendanceLogs.length === 0 ? (
                  <Typography variant="body2" sx={{ color: '#94A3B8' }}>
                    No prior session logs in database.
                  </Typography>
                ) : (
                  attendanceLogs.slice(0, 5).map((log, idx) => {
                    const totalStudents = log.records?.length || 0;
                    const present = log.records?.filter((r) => r.status === 'Present').length || 0;
                    const percent = totalStudents ? Math.round((present / totalStudents) * 100) : 100;
                    return (
                      <Box
                        key={log._id || idx}
                        sx={{
                          p: 1.8,
                          borderRadius: 2,
                          bgcolor: '#F8FAFC',
                          border: '1px solid #E5EBF5',
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1E6BFF' }}>
                            {log.courseCode}
                          </Typography>
                          <Chip label={`${percent}% Present`} size="small" sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700 }} />
                        </Box>
                        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
                          Recorded on {new Date(log.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#475569' }}>
                          Marked by: <strong>{log.markedBy || 'Faculty'}</strong> ({present}/{totalStudents} attended)
                        </Typography>
                      </Box>
                    );
                  })
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default AttendancePage;
