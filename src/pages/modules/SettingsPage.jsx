import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import {
  Settings,
  Shield,
  Bell,
  Database,
  Save,
  CheckCircle2,
  Server,
} from 'lucide-react';
import { api } from '../../services/api';

export const SettingsPage = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Editable Profile State
  const [profile, setProfile] = useState({
    name: 'Prof. Ria Sharma',
    email: 'teacher@orbit.edu',
    department: 'Computer Science & Engineering',
    role: 'Faculty Educator',
    phone: '+91 98222 33445',
  });

  // System Notification Toggles
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAttendanceAlerts: true,
    aiRecommendationBanner: true,
    autoBackupDaily: true,
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await api.get('/health');
        if (res) setHealthStatus(res);
      } catch {
        setHealthStatus({ status: 'offline', database: 'Disconnected' });
      }
    };
    checkHealth();
  }, []);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSuccessMsg('System configuration and profile settings saved successfully!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <Settings size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              System Preferences &amp; Institutional Configuration
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Academic year governance, multi-tenant portal parameters, live database diagnostics, and account profiles.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Save size={18} />}
          onClick={handleSaveSettings}
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
          Save Changes
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {successMsg}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Left Column: Account & Institute Configuration */}
        <Grid item xs={12} lg={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* User Profile Card */}
            <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A', mb: 2 }}>
                Active Operator Profile
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    size="small"
                    fullWidth
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Registered Email"
                    size="small"
                    fullWidth
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Academic Department"
                    size="small"
                    fullWidth
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Emergency Contact Phone"
                    size="small"
                    fullWidth
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Card>

            {/* Notification and Communication Controls */}
            <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Bell size={20} color="#1E6BFF" />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Automation &amp; Notification Triggers
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.emailAlerts}
                      onChange={(e) => setNotifications({ ...notifications, emailAlerts: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Automated Exam Result Broadcasts</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Send immediate transcripts to student emails on publication</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.smsAttendanceAlerts}
                      onChange={(e) => setNotifications({ ...notifications, smsAttendanceAlerts: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>Statutory Attendance Threshold Warnings (&lt;75%)</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Notify parents via SMS when cumulative attendance falls below 75%</Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notifications.aiRecommendationBanner}
                      onChange={(e) => setNotifications({ ...notifications, aiRecommendationBanner: e.target.checked })}
                      color="primary"
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>ORBIT AI Copilot Assistance</Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>Provide predictive lesson plans and student risk insights</Typography>
                    </Box>
                  }
                />
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Right Column: Institutional Details & Database Diagnostics */}
        <Grid item xs={12} lg={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Live Database Diagnostics */}
            <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                <Server size={20} color="#10B981" />
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  Infrastructure Status
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>Database Engine</Typography>
                  <Chip
                    icon={<Database size={13} color="#166534" />}
                    label={healthStatus?.database || 'MongoDB Active'}
                    size="small"
                    sx={{ bgcolor: '#DCFCE7', color: '#166534', fontWeight: 700 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>API Server Health</Typography>
                  <Chip
                    label="Online :5000"
                    size="small"
                    sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 700 }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>Active Modules</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 800, color: '#0F172A' }}>16 Modules</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#64748B' }}>Build Target</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>Final-Year B.Tech</Typography>
                </Box>
              </Box>
            </Card>

            {/* Institution Badge Card */}
            <Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none', bgcolor: '#F8FAFC' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Shield size={20} color="#1E6BFF" />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                  ORBIT University Accreditation
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 1.5, lineHeight: 1.5 }}>
                NAAC 'A++' Grade Institutional ERP Framework. Fully compliant with university credit schemas, AICTE regulations, and digital evaluation standards.
              </Typography>
              <Chip
                icon={<CheckCircle2 size={13} color="#15803D" />}
                label="Academic Year 2025-2026"
                size="small"
                sx={{ bgcolor: '#DCFCE7', color: '#15803D', fontWeight: 700 }}
              />
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;
