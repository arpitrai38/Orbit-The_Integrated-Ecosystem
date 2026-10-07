import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ShieldAlert,
  GraduationCap,
  UserCheck,
  Users,
  LogIn,
  UserPlus,
  Phone,
  Building,
} from 'lucide-react';

import { OrbitLogo } from '../../components/common/OrbitLogo';
import { AppButton } from '../../components/common/AppButton';
import { ROUTES } from '../../routes/routeConfig';
import { api } from '../../services/api';

const PORTALS = [
  {
    id: 'ADMIN',
    title: 'Admin ERP',
    fullTitle: 'Administrative & Directorate Portal',
    icon: ShieldAlert,
    color: '#1E6BFF',
    bgColor: '#EFF6FF',
    description: 'Centralized institutional control, financial ledgers, and capacity governance.',
    route: ROUTES.ADMIN.DASHBOARD,
    departmentDefault: 'Academic Directorate',
  },
  {
    id: 'TEACHER',
    title: 'Faculty / Teacher',
    fullTitle: 'Faculty Academic & LMS Suite',
    icon: GraduationCap,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    description: 'Lecture management, student attendance marking, lesson plans, and assignments.',
    route: ROUTES.FACULTY.DASHBOARD,
    departmentDefault: 'Computer Science & Engineering',
  },
  {
    id: 'STUDENT',
    title: 'Student Hub',
    fullTitle: 'Student Learning & Grade Hub',
    icon: UserCheck,
    color: '#10B981',
    bgColor: '#ECFDF5',
    description: 'Coursework tracking, lecture timetable, homework submissions, and GPA report cards.',
    route: ROUTES.STUDENT.DASHBOARD,
    departmentDefault: 'Computer Science & Engineering',
  },
  {
    id: 'PARENT',
    title: 'Parent Portal',
    fullTitle: 'Parent & Guardian Oversight',
    icon: Users,
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    description: 'Live attendance monitoring, term progress reports, and digital fee payment gateway.',
    route: ROUTES.PARENT.DASHBOARD,
    departmentDefault: 'Parent Association',
  },
];

export const LoginPage = () => {
  const navigate = useNavigate();
  const [selectedPortal, setSelectedPortal] = useState('ADMIN');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Registration form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerDepartment, setRegisterDepartment] = useState('Computer Science & Engineering');
  const [registerPhone, setRegisterPhone] = useState('');

  const activePortalConfig = PORTALS.find((p) => p.id === selectedPortal) || PORTALS[0];
  const PortalIcon = activePortalConfig.icon;

  const handlePortalChange = (portalId) => {
    setSelectedPortal(portalId);
    setErrorMsg('');
    setNotification('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMsg('Please enter both your institutional email and password.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setNotification('');

    try {
      const res = await api.post('/auth/login', {
        email: loginEmail.trim(),
        password: loginPassword,
        role: selectedPortal,
      });

      if (res.token) {
        localStorage.setItem('orbit_auth_token', res.token);
        localStorage.setItem('orbit_user_profile', JSON.stringify(res.user));
        localStorage.setItem('orbit_active_role', res.user.role);
      }

      setNotification(`Welcome back, ${res.user?.name}! Opening ${activePortalConfig.title}...`);

      setTimeout(() => {
        navigate(activePortalConfig.route);
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Please verify your credentials or register a new account.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setNotification('');

    try {
      const res = await api.post('/auth/register', {
        name: registerName.trim(),
        email: registerEmail.trim(),
        password: registerPassword,
        role: selectedPortal,
        department: registerDepartment,
        phone: registerPhone.trim(),
      });

      if (res.token) {
        localStorage.setItem('orbit_auth_token', res.token);
        localStorage.setItem('orbit_user_profile', JSON.stringify(res.user));
        localStorage.setItem('orbit_active_role', res.user.role);
      }

      setNotification(`Account created for ${res.user?.name} as ${selectedPortal}! Accessing portal...`);

      setTimeout(() => {
        navigate(activePortalConfig.route);
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. User may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 580,
        boxShadow: '0 20px 40px -10px rgba(30, 107, 255, 0.14)',
        borderRadius: 3.5,
        border: '1px solid #E5EBF5',
        bgcolor: '#FFFFFF',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4.5 } }}>
        {/* Brand Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <OrbitLogo size={44} sx={{ mb: 1.5 }} />
          <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
            ORBIT Enterprise Portals
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', mt: 0.5 }}>
            Integrated College ERP &amp; Learning Management System
          </Typography>
        </Box>

        {/* 4 Dedicated Portal Switcher Grid */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="caption"
            sx={{ fontWeight: 700, display: 'block', mb: 1.2, color: '#475569', textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: '0.04em' }}
          >
            Select Target Portal
          </Typography>

          <Grid container spacing={1.5}>
            {PORTALS.map((portal) => {
              const Icon = portal.icon;
              const isSelected = selectedPortal === portal.id;
              return (
                <Grid item xs={6} sm={3} key={portal.id}>
                  <Box
                    onClick={() => handlePortalChange(portal.id)}
                    sx={{
                      p: 1.5,
                      borderRadius: 2.5,
                      textAlign: 'center',
                      cursor: 'pointer',
                      border: '1.5px solid',
                      borderColor: isSelected ? portal.color : '#E2E8F0',
                      bgcolor: isSelected ? portal.bgColor : '#F8FAFC',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        borderColor: portal.color,
                        bgcolor: portal.bgColor,
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        width: 34,
                        height: 34,
                        mx: 'auto',
                        mb: 1,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: isSelected ? portal.color : '#FFFFFF',
                        color: isSelected ? '#FFFFFF' : portal.color,
                        boxShadow: isSelected ? `0 4px 10px ${portal.color}40` : 'none',
                      }}
                    >
                      <Icon size={18} />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: isSelected ? 800 : 600,
                        fontSize: '0.78rem',
                        color: isSelected ? portal.color : '#334155',
                        lineHeight: 1.2,
                      }}
                    >
                      {portal.title}
                    </Typography>
                  </Box>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Portal Information Card */}
        <Box
          sx={{
            p: 2,
            mb: 3,
            borderRadius: 2.5,
            bgcolor: activePortalConfig.bgColor,
            border: `1px solid ${activePortalConfig.color}25`,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              color: activePortalConfig.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PortalIcon size={20} />
          </Box>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                {activePortalConfig.fullTitle}
              </Typography>
              <Chip
                label={activePortalConfig.id}
                size="small"
                sx={{
                  bgcolor: activePortalConfig.color,
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.65rem',
                  height: 18,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.2 }}>
              {activePortalConfig.description}
            </Typography>
          </Box>
        </Box>

        {/* Login / Register Mode Toggle */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={authMode}
            onChange={(_, val) => {
              setAuthMode(val);
              setErrorMsg('');
              setNotification('');
            }}
            variant="fullWidth"
            sx={{
              borderBottom: '1px solid #E5EBF5',
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 700,
                fontSize: '0.875rem',
                minHeight: 44,
                color: '#64748B',
                '&.Mui-selected': { color: activePortalConfig.color },
              },
              '& .MuiTabs-indicator': {
                bgcolor: activePortalConfig.color,
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab value="login" icon={<LogIn size={15} />} iconPosition="start" label={`Sign In (${activePortalConfig.title})`} />
            <Tab value="register" icon={<UserPlus size={15} />} iconPosition="start" label={`Register New ${activePortalConfig.title}`} />
          </Tabs>
        </Box>

        {/* Notifications & Error Banners */}
        {notification && (
          <Alert severity="success" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}>
            {notification}
          </Alert>
        )}

        {errorMsg && (
          <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}>
            {errorMsg}
          </Alert>
        )}

        {/* 1. SIGN IN FORM */}
        {authMode === 'login' && (
          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2.2 }}>
            <TextField
              label="Institutional Email"
              type="email"
              placeholder={`e.g. yourname@orbit.edu`}
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#94A3B8" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your security password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="#94A3B8" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="caption"
                sx={{ color: '#64748B', cursor: 'pointer', '&:hover': { color: activePortalConfig.color } }}
                onClick={() => setAuthMode('register')}
              >
                No account yet? <strong>Create a new account</strong>
              </Typography>
              <Typography
                component={NavLink}
                to={ROUTES.AUTH.FORGOT_PASSWORD}
                variant="caption"
                sx={{
                  color: activePortalConfig.color,
                  textDecoration: 'none',
                  fontWeight: 600,
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                Forgot password?
              </Typography>
            </Box>

            <AppButton
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              fullWidth
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                borderRadius: 2.5,
                backgroundColor: activePortalConfig.color,
                boxShadow: `0 4px 14px ${activePortalConfig.color}40`,
                '&:hover': { backgroundColor: activePortalConfig.color, filter: 'brightness(0.92)' },
              }}
            >
              Sign In to {activePortalConfig.title} Portal
            </AppButton>
          </Box>
        )}

        {/* 2. REGISTRATION FORM */}
        {authMode === 'register' && (
          <Box component="form" onSubmit={handleRegister} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              size="small"
              placeholder="e.g. John Doe / Prof. Sarah Smith"
              value={registerName}
              onChange={(e) => setRegisterName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={18} color="#94A3B8" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <TextField
              label="Institutional Email"
              type="email"
              required
              fullWidth
              size="small"
              placeholder="e.g. username@orbit.edu"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#94A3B8" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl size="small" fullWidth required>
                  <InputLabel>Academic Department</InputLabel>
                  <Select
                    value={registerDepartment}
                    label="Academic Department"
                    onChange={(e) => setRegisterDepartment(e.target.value)}
                    sx={{ borderRadius: 2 }}
                  >
                    <MenuItem value="Computer Science & Engineering">Computer Science &amp; Eng.</MenuItem>
                    <MenuItem value="Information Technology">Information Technology</MenuItem>
                    <MenuItem value="Electronics & Communication">Electronics &amp; Comm.</MenuItem>
                    <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
                    <MenuItem value="Academic Directorate">Academic Directorate</MenuItem>
                    <MenuItem value="Parent Association">Parent Association</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Contact Phone"
                  size="small"
                  fullWidth
                  placeholder="+91 98000 12345"
                  value={registerPhone}
                  onChange={(e) => setRegisterPhone(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone size={16} color="#94A3B8" />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2 },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              label="Choose Security Password"
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              size="small"
              placeholder="Minimum 6 characters"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={18} color="#94A3B8" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />

            <AppButton
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              fullWidth
              sx={{
                mt: 1,
                py: 1.2,
                fontWeight: 700,
                borderRadius: 2.5,
                backgroundColor: activePortalConfig.color,
                boxShadow: `0 4px 14px ${activePortalConfig.color}40`,
                '&:hover': { backgroundColor: activePortalConfig.color, filter: 'brightness(0.92)' },
              }}
            >
              Create Account &amp; Access {activePortalConfig.title}
            </AppButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginPage;
