import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import {
  GraduationCap,
  HardDrive,
  CalendarCheck,
  CircleDollarSign,
  AlertCircle,
  PiggyBank,
  Users,
  UserCheck,
  CreditCard,
  Search,
  Layers,
  Percent,
  Tag,
  Plus,
  Download,
  FileText,
  Bell,
  Cake,
  CheckCircle,
} from 'lucide-react';
import {
  ResponsiveContainer as ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import { ResponsiveContainer } from '../../components/common/ResponsiveContainer';
import { SchoolCalendarChart } from '../../components/dashboard/SchoolCalendarChart';
import { useThemeMode } from '../../hooks/useThemeMode';
import { getDynamicGreeting, getLoggedInUser } from '../../utils/greeting';
import { ROUTES } from '../../routes/routeConfig';
import { api } from '../../services/api';

// Initial zero-state chart data
const DEFAULT_ZERO_CHART_15D = [
  { day: 'Sep 15', collections: 0, target: 0 },
  { day: 'Sep 17', collections: 0, target: 0 },
  { day: 'Sep 19', collections: 0, target: 0 },
  { day: 'Sep 21', collections: 0, target: 0 },
  { day: 'Sep 23', collections: 0, target: 0 },
  { day: 'Sep 25', collections: 0, target: 0 },
  { day: 'Sep 27', collections: 0, target: 0 },
  { day: 'Sep 29', collections: 0, target: 0 },
];

const DEFAULT_ZERO_CHART_30D = [
  { day: 'Week 1', collections: 0, target: 0 },
  { day: 'Week 2', collections: 0, target: 0 },
  { day: 'Week 3', collections: 0, target: 0 },
  { day: 'Week 4', collections: 0, target: 0 },
];

const DEPT_COLORS = ['#1E6BFF', '#0D9488', '#10B981', '#F59E0B', '#8B5CF6'];

export const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const user = getLoggedInUser('Administrator');
  const greeting = getDynamicGreeting();

  const isDark = mode === 'dark';
  const subtleBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5EBF5';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';

  const [activeTab, setActiveTab] = useState(0);
  const [chartPeriod, setChartPeriod] = useState('15d'); // '15d' | '30d'

  // Dynamic real-time metrics initialized to zero
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    studentLimit: 100,
    storageUsedMB: 0,
    storageLimitMB: 1024,
    attendanceToday: 0,
    attendanceRate: 0,
    monthlyFeesCollected: 0,
    feesTarget: 0,
    totalFeesDue: 0,
    monthlyIncome: 0,
    totalStaff: 0,
    staffOnLeave: 0,
  });

  const [feeChartData, setFeeChartData] = useState(DEFAULT_ZERO_CHART_15D);
  const [departmentData, setDepartmentData] = useState([]);
  const [staffOnLeaveList, setStaffOnLeaveList] = useState([]);
  const [noticesList, setNoticesList] = useState([]);

  // Fetch real-time data from database
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [metricRes, feeRes, studentRes, noticeRes, leaveRes] = await Promise.allSettled([
          api.get('/admin/metrics'),
          api.get('/fees'),
          api.get('/students'),
          api.get('/notices'),
          api.get('/leaves'),
        ]);

        // 1. Process Metrics
        if (metricRes.status === 'fulfilled' && metricRes.value?.data) {
          const d = metricRes.value.data;
          setMetrics((prev) => ({
            ...prev,
            totalStudents: d.studentCapacity?.enrolled || 0,
            monthlyFeesCollected: d.monthlyFees?.collected || 0,
            totalFeesDue: d.feesDue?.dueAmount || 0,
            monthlyIncome: d.incomeThisMonth?.gross || 0,
            totalStaff: d.staffTotal?.total || 0,
            staffOnLeave: d.staffOnLeave?.onLeave || 0,
          }));
        }

        // 2. Process Students & Department Distribution
        if (studentRes.status === 'fulfilled' && Array.isArray(studentRes.value?.data)) {
          const students = studentRes.value.data;
          if (students.length > 0) {
            const counts = {};
            students.forEach((s) => {
              const dept = s.department || 'General';
              counts[dept] = (counts[dept] || 0) + 1;
            });
            const dist = Object.keys(counts).map((dept, index) => ({
              name: dept,
              value: counts[dept],
              color: DEPT_COLORS[index % DEPT_COLORS.length],
            }));
            setDepartmentData(dist);
            setMetrics((prev) => ({ ...prev, totalStudents: students.length }));
          } else {
            setDepartmentData([]);
          }
        }

        // 3. Process Fees & Real-Time Collections
        if (feeRes.status === 'fulfilled' && Array.isArray(feeRes.value?.data)) {
          const fees = feeRes.value.data;
          if (fees.length > 0) {
            const totalCollected = fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0);
            const totalDue = fees
              .filter((f) => f.status === 'Pending' || f.status === 'Overdue')
              .reduce((sum, f) => sum + (f.totalAmount - (f.paidAmount || 0)), 0);

            setMetrics((prev) => ({
              ...prev,
              monthlyFeesCollected: totalCollected,
              totalFeesDue: totalDue,
              monthlyIncome: totalCollected,
            }));

            // If collections exist, plot actual values on recent dates
            const updatedChart = DEFAULT_ZERO_CHART_15D.map((item, idx) => {
              if (idx === DEFAULT_ZERO_CHART_15D.length - 1) {
                return { ...item, collections: Number((totalCollected / 100000).toFixed(2)) };
              }
              return item;
            });
            setFeeChartData(updatedChart);
          }
        }

        // 4. Process Real Notices
        if (noticeRes.status === 'fulfilled' && Array.isArray(noticeRes.value?.data)) {
          setNoticesList(noticeRes.value.data);
        }

        // 5. Process Staff Leaves
        if (leaveRes.status === 'fulfilled' && Array.isArray(leaveRes.value?.data)) {
          const approved = leaveRes.value.data.filter((l) => l.status === 'Approved');
          setStaffOnLeaveList(approved);
          setMetrics((prev) => ({ ...prev, staffOnLeave: approved.length }));
        }
      } catch {
        // Fallback remains clean 0
      }
    };

    fetchDashboardStats();
  }, []);

  // 8 Metric Cards directly matching user reference Image 2
  const topMetrics = [
    {
      title: 'Student Limit',
      metric: `${metrics.totalStudents} / ${metrics.studentLimit}`,
      progress: metrics.totalStudents ? (metrics.totalStudents / metrics.studentLimit) * 100 : 0,
      color: '#0284C7',
      sub: metrics.totalStudents > 0 ? `${metrics.totalStudents} Enrolled` : '0 / 100 Used (0% Enrolled)',
      icon: GraduationCap,
      route: ROUTES.MODULES.STUDENTS,
    },
    {
      title: 'Storage Usage',
      metric: `${metrics.storageUsedMB.toFixed(2)} MB / ${metrics.storageLimitMB} MB`,
      progress: 0,
      color: '#0D9488',
      sub: `${metrics.storageUsedMB.toFixed(2)} MB / 1024 MB Used (0%)`,
      icon: HardDrive,
      route: ROUTES.MODULES.REPORTS,
    },
    {
      title: 'Student Attendance',
      metric: `${metrics.attendanceRate}%`,
      progress: metrics.attendanceRate,
      color: '#16A34A',
      sub: metrics.attendanceToday > 0 ? `${metrics.attendanceToday} Present Today` : '0% (0 Present Today)',
      icon: CalendarCheck,
      route: ROUTES.MODULES.ATTENDANCE,
    },
    {
      title: 'Monthly Fee Progress',
      metric: `₹${metrics.monthlyFeesCollected.toLocaleString('en-IN')}`,
      progress: metrics.feesTarget > 0 ? (metrics.monthlyFeesCollected / metrics.feesTarget) * 100 : 0,
      color: '#EAB308',
      sub: `₹${metrics.monthlyFeesCollected.toLocaleString('en-IN')} Collected`,
      icon: CircleDollarSign,
      route: ROUTES.MODULES.FEES,
    },
    {
      title: 'Total Fees Due',
      metric: `₹${metrics.totalFeesDue.toLocaleString('en-IN')}`,
      progress: 0,
      color: '#EF4444',
      sub: `₹${metrics.totalFeesDue.toLocaleString('en-IN')} Outstanding`,
      icon: AlertCircle,
      route: ROUTES.MODULES.FEES,
    },
    {
      title: 'Income This Month',
      metric: `₹${metrics.monthlyIncome.toLocaleString('en-IN')}`,
      progress: 0,
      color: '#8B5CF6',
      sub: `₹${metrics.monthlyIncome.toLocaleString('en-IN')} Realized`,
      icon: PiggyBank,
      route: ROUTES.MODULES.FEES,
    },
    {
      title: 'Total Staff',
      metric: `${metrics.totalStaff}`,
      progress: 0,
      color: '#06B6D4',
      sub: `${metrics.totalStaff} Staff Records`,
      icon: Users,
      route: ROUTES.MODULES.CLASSES,
    },
    {
      title: 'Staff On Leave',
      metric: `${metrics.staffOnLeave}`,
      progress: 0,
      color: '#EC4899',
      sub: metrics.staffOnLeave > 0 ? `${metrics.staffOnLeave} on Leave` : '0 (All staff are present)',
      icon: UserCheck,
      route: ROUTES.MODULES.LEAVES,
    },
  ];

  // Quick action navigation buttons (from user reference Image 2)
  const quickActionTiles = [
    {
      label: 'Collect Fees',
      color: '#16A34A',
      icon: CircleDollarSign,
      count: `₹${metrics.monthlyFeesCollected.toLocaleString('en-IN')} collected`,
      route: ROUTES.MODULES.FEES,
    },
    {
      label: 'Search Due Fees',
      color: '#EAB308',
      icon: Search,
      count: `${metrics.totalFeesDue > 0 ? 'Pending dues' : '0 accounts pending'}`,
      route: ROUTES.MODULES.FEES,
    },
    {
      label: 'Online Transactions',
      color: '#0284C7',
      icon: CreditCard,
      count: '0 settled today',
      route: ROUTES.MODULES.FEES,
    },
    {
      label: 'Assign Fees',
      color: '#0D9488',
      icon: Layers,
      count: '0 allocated',
      route: ROUTES.MODULES.FEES,
    },
    {
      label: 'Fee Groups',
      color: '#7C3AED',
      icon: Tag,
      count: '0 active groups',
      route: ROUTES.MODULES.FEES,
    },
    {
      label: 'Fees Discount',
      color: '#EA580C',
      icon: Percent,
      count: '0 waivers',
      route: ROUTES.MODULES.FEES,
    },
    {
      label: 'Fee Types',
      color: '#475569',
      icon: FileText,
      count: 'Tuition, Lab, Exam',
      route: ROUTES.MODULES.FEES,
    },
    {
      label: 'New Admission',
      color: '#1E6BFF',
      icon: GraduationCap,
      count: `${metrics.totalStudents} admitted`,
      route: ROUTES.MODULES.STUDENTS,
    },
  ];

  const tabCategories = [
    'Fees & Finance',
    'Student Information',
    'Academics',
    'Offline Exams',
    'Online Exams',
    'Accounts & HR',
  ];

  const activeChartData = chartPeriod === '15d' ? feeChartData : DEFAULT_ZERO_CHART_30D;

  return (
    <ResponsiveContainer>
      {/* 1. Top Header with Real-Time Greeting & Fast Actions */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
              {greeting}, {user.name} 🛡️
            </Typography>
            <Chip
              label="Live ERP Grid"
              size="small"
              sx={{
                height: 22,
                fontSize: '0.68rem',
                fontWeight: 700,
                bgcolor: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                border: '1px solid rgba(16, 185, 129, 0.25)',
              }}
            />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Institution Control Centre • Real-time Academic &amp; Financial Operations
          </Typography>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download size={15} />}
            onClick={() => navigate(ROUTES.MODULES.REPORTS)}
            sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}
          >
            Export Audit
          </Button>
          <Button
            variant="contained"
            size="small"
            startIcon={<Plus size={15} />}
            onClick={() => navigate(ROUTES.MODULES.STUDENTS)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: '#1E6BFF',
              boxShadow: '0 4px 12px rgba(30, 107, 255, 0.25)',
            }}
          >
            New Admission
          </Button>
        </Stack>
      </Box>

      {/* 2. 8-Grid Metric Cards (Directly matching user reference Image 2) */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {topMetrics.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={3} key={card.title}>
              <Card
                onClick={() => navigate(card.route)}
                sx={{
                  p: 2.2,
                  borderRadius: 3,
                  border: `1px solid ${subtleBorder}`,
                  bgcolor: cardBg,
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.06)',
                    borderColor: card.color,
                  },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 700,
                      color: 'text.secondary',
                      textTransform: 'uppercase',
                      letterSpacing: '0.03em',
                      fontSize: '0.68rem',
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: `${card.color}15`,
                      color: card.color,
                    }}
                  >
                    <Icon size={18} />
                  </Box>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: '-0.01em' }}>
                  {card.metric}
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={Math.min(card.progress, 100)}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: `${card.color}18`,
                    mb: 1,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: card.color,
                      borderRadius: 3,
                    },
                  }}
                />

                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.72rem', display: 'block' }}>
                  {card.sub}
                </Typography>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* 3. Middle Section: Module Quick Action Hub + Bar Chart */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Left Column: Module Actions & Interactive Bar Chart */}
        <Grid item xs={12} lg={8}>
          {/* Quick Action Category Hub (matching Image 2) */}
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: `1px solid ${subtleBorder}`,
              bgcolor: cardBg,
              mb: 2.5,
            }}
          >
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: `1px solid ${subtleBorder}`,
                mb: 2,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  minHeight: 40,
                  px: 1.5,
                },
              }}
            >
              {tabCategories.map((cat) => (
                <Tab key={cat} label={cat} />
              ))}
            </Tabs>

            <Grid container spacing={1.5}>
              {quickActionTiles.map((action) => {
                const Icon = action.icon;
                return (
                  <Grid item xs={6} sm={4} md={3} key={action.label}>
                    <Box
                      onClick={() => navigate(action.route)}
                      sx={{
                        p: 1.5,
                        borderRadius: 2.5,
                        border: `1px solid ${subtleBorder}`,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                        '&:hover': {
                          borderColor: action.color,
                          bgcolor: `${action.color}08`,
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          mx: 'auto',
                          mb: 1,
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: action.color,
                          color: '#FFFFFF',
                          boxShadow: `0 3px 8px ${action.color}35`,
                        }}
                      >
                        <Icon size={18} />
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, fontSize: '0.78rem', mb: 0.2 }}>
                        {action.label}
                      </Typography>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', display: 'block' }}>
                        {action.count}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          </Card>

          {/* Bar Chart: Fee Collections vs Target (Matching Image 2) */}
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: `1px solid ${subtleBorder}`,
              bgcolor: cardBg,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                  Fee Collection (Last 15 Days)
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Realized institutional cashflow vs budget target (In Lakhs ₹)
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  size="small"
                  variant={chartPeriod === '15d' ? 'contained' : 'outlined'}
                  onClick={() => setChartPeriod('15d')}
                  sx={{ fontSize: '0.72rem', py: 0.25, borderRadius: 2 }}
                >
                  Last 15 Days
                </Button>
                <Button
                  size="small"
                  variant={chartPeriod === '30d' ? 'contained' : 'outlined'}
                  onClick={() => setChartPeriod('30d')}
                  sx={{ fontSize: '0.72rem', py: 0.25, borderRadius: 2 }}
                >
                  Monthly View
                </Button>
              </Stack>
            </Box>

            <Box sx={{ width: '100%', height: 260 }}>
              <ChartContainer width="100%" height="100%">
                <BarChart data={activeChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9'} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} unit="L" domain={[0, 'auto']} />
                  <ChartTooltip
                    formatter={(value) => [`₹${value} Lakhs`, 'Amount']}
                    contentStyle={{
                      backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                      border: `1px solid ${subtleBorder}`,
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="collections" name="Actual Collections" fill="#1E6BFF" radius={[5, 5, 0, 0]} />
                  <Bar dataKey="target" name="Target Budget" fill="#93C5FD" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </Box>
          </Card>
        </Grid>

        {/* Right Column: Department Donut Chart & Staff On Leave Banner */}
        <Grid item xs={12} lg={4}>
          {/* Department Capacity Donut Chart */}
          <Card
            sx={{
              p: 2.5,
              borderRadius: 3,
              border: `1px solid ${subtleBorder}`,
              bgcolor: cardBg,
              mb: 2.5,
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 0.5 }}>
              Department Enrollment
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
              {metrics.totalStudents > 0
                ? `Distribution of ${metrics.totalStudents} admitted students`
                : 'No student admissions recorded yet'}
            </Typography>

            <Box sx={{ width: '100%', height: 200, position: 'relative' }}>
              <ChartContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={
                      departmentData.length > 0
                        ? departmentData
                        : [{ name: 'Empty', value: 1, color: isDark ? '#334155' : '#E2E8F0' }]
                    }
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={departmentData.length > 0 ? 3 : 0}
                    dataKey="value"
                  >
                    {(departmentData.length > 0
                      ? departmentData
                      : [{ name: 'Empty', value: 1, color: isDark ? '#334155' : '#E2E8F0' }]
                    ).map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  {departmentData.length > 0 && (
                    <ChartTooltip
                      formatter={(val) => [`${val} Students`, 'Enrolled']}
                      contentStyle={{
                        backgroundColor: isDark ? '#1E293B' : '#FFFFFF',
                        border: `1px solid ${subtleBorder}`,
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                  )}
                </PieChart>
              </ChartContainer>

              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  pointerEvents: 'none',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  {metrics.totalStudents}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                  Students
                </Typography>
              </Box>
            </Box>

            <Stack spacing={0.8} sx={{ mt: 1.5 }}>
              {departmentData.length > 0 ? (
                departmentData.map((dept) => (
                  <Box key={dept.name} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: dept.color }} />
                      <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.72rem' }}>
                        {dept.name}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>
                      {dept.value}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Admissions will appear here dynamically as students enroll.
                  </Typography>
                </Box>
              )}
            </Stack>
          </Card>

          {/* Staff On Leave Today (Matching yellow card from Image 2) */}
          <Card
            sx={{
              borderRadius: 3,
              border: `1px solid ${subtleBorder}`,
              bgcolor: cardBg,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                p: 1.8,
                bgcolor: '#EAB308',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Users size={18} />
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                Staff on Leave Today ({metrics.staffOnLeave})
              </Typography>
            </Box>

            <Box sx={{ p: 2 }}>
              {staffOnLeaveList.length > 0 ? (
                <Stack spacing={1.5}>
                  {staffOnLeaveList.map((leave) => (
                    <Box
                      key={leave._id || leave.reason}
                      sx={{
                        p: 1.2,
                        borderRadius: 2,
                        bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                        border: `1px solid ${subtleBorder}`,
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                          {leave.userName || 'Faculty Member'}
                        </Typography>
                        <Chip label="Leave Approved" size="small" color="warning" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                        Reason: {leave.reason || 'Personal'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, py: 1 }}>
                  <CheckCircle size={18} color="#16A34A" />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                    All staff are present.
                  </Typography>
                </Box>
              )}
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* 4. Bottom Section: School Calendar & Notice Board (Matching Image 3) */}
      <Grid container spacing={2.5}>
        {/* School & College Calendar (matching Image 3 with proper chart grid, day & date in every box) */}
        <Grid item xs={12} lg={8}>
          <SchoolCalendarChart title="School & College Calendar" />
        </Grid>

        {/* Right Column: Upcoming Birthdays & Notice Board (Matching Image 3) */}
        <Grid item xs={12} lg={4}>
          <Stack spacing={2.5}>
            {/* Upcoming Birthdays Card (Green banner from Image 3) */}
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${subtleBorder}`,
                bgcolor: cardBg,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 1.8,
                  bgcolor: '#10B981',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Cake size={18} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Upcoming Birthdays
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 1 }}>
                  No birthdays this week.
                </Typography>
              </Box>
            </Card>

            {/* Notice Board Card (Red banner from Image 3) */}
            <Card
              sx={{
                borderRadius: 3,
                border: `1px solid ${subtleBorder}`,
                bgcolor: cardBg,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  p: 1.8,
                  bgcolor: '#EF4444',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Bell size={18} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                  Notice Board
                </Typography>
              </Box>
              <Box sx={{ p: 2 }}>
                {noticesList.length > 0 ? (
                  <Stack spacing={1.5}>
                    {noticesList.map((notice) => (
                      <Box
                        key={notice._id || notice.title}
                        onClick={() => navigate(ROUTES.MODULES.COMMUNICATION)}
                        sx={{
                          p: 1.2,
                          borderRadius: 2,
                          border: `1px solid ${subtleBorder}`,
                          bgcolor: isDark ? 'rgba(255,255,255,0.03)' : '#F8FAFC',
                          cursor: 'pointer',
                          transition: '0.2s',
                          '&:hover': { borderColor: '#1E6BFF', bgcolor: 'rgba(30, 107, 255, 0.04)' },
                        }}
                      >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Chip label={notice.category || 'General'} size="small" color="primary" sx={{ height: 18, fontSize: '0.62rem', fontWeight: 700 }} />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.65rem' }}>
                            {notice.createdAt ? new Date(notice.createdAt).toLocaleDateString('en-IN') : 'Today'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '0.78rem' }}>
                          {notice.title}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                      No new notices published yet.
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => navigate(ROUTES.MODULES.COMMUNICATION)}
                      sx={{ fontSize: '0.72rem', textTransform: 'none', borderRadius: 1.5 }}
                    >
                      Publish Notice
                    </Button>
                  </Box>
                )}
              </Box>
            </Card>
          </Stack>
        </Grid>
      </Grid>
    </ResponsiveContainer>
  );
};

export default AdminDashboardPage;
