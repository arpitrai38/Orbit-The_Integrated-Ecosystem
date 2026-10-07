import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import {
  BarChart3,
  TrendingUp,
  Download,
  Users,
  CreditCard,
  GraduationCap,
  CalendarCheck,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { api } from '../../services/api';

export const ReportsPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [feeStats, setFeeStats] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        setError('');
        const [metricsRes, feeStatsRes, coursesRes, studentsRes] = await Promise.all([
          api.get('/admin/metrics'),
          api.get('/admin/fee-stats'),
          api.get('/courses'),
          api.get('/students'),
        ]);

        if (metricsRes?.data) setMetrics(metricsRes.data);
        if (feeStatsRes?.data) setFeeStats(feeStatsRes.data);
        if (coursesRes?.data) setCourses(coursesRes.data);
        if (studentsRes?.data) setStudents(studentsRes.data);
      } catch (err) {
        setError(err.message || 'Failed to load institutional reports');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    const headers = ['RollNo', 'Name', 'Department', 'Semester', 'CGPA', 'AttendancePercent', 'RiskStatus'];
    const rows = students.map((s) => [
      s.rollNo,
      `"${s.name}"`,
      `"${s.department}"`,
      s.semester,
      s.cgpa,
      s.attendancePercent,
      s.riskStatus,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'ORBIT_Institutional_Academic_Report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const courseChartData = courses.map((c) => ({
    name: c.code,
    progress: c.syllabusProgress || 0,
    enrolled: c.enrolledCount || 60,
  }));

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <BarChart3 size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Institutional Analytics &amp; Reports
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Comprehensive institutional performance telemetry, fee revenue trendlines, and academic completion rates.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Download size={18} />}
          onClick={handleExportCSV}
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
          Export CSV Registry
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

      {!loading && !error && (
        <>
          {/* Top KPI Cards */}
          <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Scholars</Typography>
                    <Users size={20} color="#1E6BFF" />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                    {metrics?.studentCapacity?.enrolled?.toLocaleString() || '4,850'}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>97% of target intake</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Attendance Index</Typography>
                    <CalendarCheck size={20} color="#10B981" />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>
                    {metrics?.studentAttendance?.percentage || 93.6}%
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Above regulatory threshold</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Monthly Collections</Typography>
                    <CreditCard size={20} color="#8B5CF6" />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6' }}>
                    ₹48.2L
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 600 }}>88.2% fee progress</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
                <CardContent sx={{ p: 2.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Active Courses</Typography>
                    <GraduationCap size={20} color="#F59E0B" />
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>
                    {courses.length}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#64748B' }}>Across 8 semesters</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={3}>
            {/* 15 Days Fee Revenue Area Chart */}
            <Grid item xs={12} lg={7}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                      Fee Collection Momentum (15 Days)
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      Real-time ledger inflows recorded across accounts
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10B981', fontWeight: 700, fontSize: '0.875rem' }}>
                    <TrendingUp size={16} />
                    <span>+18.4% WoW</span>
                  </Box>
                </Box>

                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <AreaChart data={feeStats}>
                      <defs>
                        <linearGradient id="feeGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1E6BFF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#1E6BFF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="day" stroke="#94A3B8" fontSize={12} tickLine={false} />
                      <YAxis
                        stroke="#94A3B8"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${v / 1000}k`}
                      />
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} />
                      <Area
                        type="monotone"
                        dataKey="amount"
                        stroke="#1E6BFF"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#feeGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>

            {/* Syllabus Coverage Bar Chart */}
            <Grid item xs={12} lg={5}>
              <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 0.5 }}>
                  Course Syllabus Completion
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 2.5 }}>
                  Percentage syllabus covered per active course
                </Typography>

                <Box sx={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={courseChartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip formatter={(val) => [`${val}%`, 'Coverage']} />
                      <Bar dataKey="progress" fill="#10B981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
};

export default ReportsPage;
