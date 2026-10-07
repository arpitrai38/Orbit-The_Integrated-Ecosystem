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
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {
  Users,
  Search,
  UserPlus,
  Trash2,
  ShieldCheck,
  GraduationCap,
  Building2,
  RefreshCw,
  Phone,
  Mail,
  UserCheck,
} from 'lucide-react';
import { api } from '../../services/api';

const DEPARTMENTS = [
  'Computer Science & Engineering',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Civil Engineering',
  'Electrical & Electronics',
  'Applied Sciences & Humanities',
  'Administration & Finance',
];

export const StaffManagementPage = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [deptFilter, setDeptFilter] = useState('All');

  // Add Staff Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'TEACHER',
    department: 'Computer Science & Engineering',
    phone: '',
    password: '',
  });

  // Delete Confirmation Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/staff');
      if (res && res.data) {
        setStaffList(res.data);
      } else if (Array.isArray(res)) {
        setStaffList(res);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch staff directory from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) {
      setError('Please provide full name and institutional email.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await api.post('/staff', {
        name: newStaff.name.trim(),
        email: newStaff.email.trim(),
        role: newStaff.role,
        department: newStaff.department,
        phone: newStaff.phone.trim(),
        password: newStaff.password.trim() || 'Staff@2026',
      });

      setSuccessMsg(`Staff member ${newStaff.name} registered successfully.`);
      setAddModalOpen(false);
      setNewStaff({
        name: '',
        email: '',
        role: 'TEACHER',
        department: 'Computer Science & Engineering',
        phone: '',
        password: '',
      });
      fetchStaff();
    } catch (err) {
      setError(err.message || 'Failed to register new staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id) => {
    try {
      await api.delete(`/staff/${id}`);
      setSuccessMsg('Staff member removed successfully.');
      setDeleteConfirmId(null);
      fetchStaff();
    } catch (err) {
      setError(err.message || 'Failed to delete staff member.');
    }
  };

  const filteredStaff = staffList.filter((member) => {
    const matchesSearch =
      (member.name && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.email && member.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (member.phone && member.phone.includes(searchTerm));

    const matchesRole = roleFilter === 'All' || member.role === roleFilter;
    const matchesDept = deptFilter === 'All' || member.department === deptFilter;

    return matchesSearch && matchesRole && matchesDept;
  });

  const totalCount = staffList.length;
  const facultyCount = staffList.filter((s) => s.role === 'TEACHER').length;
  const adminCount = staffList.filter((s) => s.role === 'ADMIN').length;
  const departmentsCount = new Set(staffList.map((s) => s.department).filter(Boolean)).size;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header Banner */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                bgcolor: '#4F46E5',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
              }}
            >
              <Users size={22} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Staff & Faculty Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Institutional directory, faculty designations, administrative credentials, and departmental profiles.
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={fetchStaff}
            disabled={loading}
            startIcon={<RefreshCw size={15} />}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: '0.8125rem',
            }}
          >
            Refresh
          </Button>

          <Button
            variant="contained"
            onClick={() => setAddModalOpen(true)}
            startIcon={<UserPlus size={16} />}
            sx={{
              bgcolor: '#4F46E5',
              '&:hover': { bgcolor: '#4338CA' },
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
              fontSize: '0.8125rem',
            }}
          >
            Add Staff Member
          </Button>
        </Box>
      </Box>

      {/* Alerts */}
      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2.5, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {successMsg && (
        <Alert severity="success" onClose={() => setSuccessMsg('')} sx={{ mb: 2.5, borderRadius: 2 }}>
          {successMsg}
        </Alert>
      )}

      {/* Metrics Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Total Staff
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EEF2FF', color: '#4F46E5' }}>
                  <Users size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {totalCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Registered in institutional registry
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Teaching Faculty
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#F0FDF4', color: '#16A34A' }}>
                  <GraduationCap size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {facultyCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Professors & Course Instructors
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Administrators
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
                  <ShieldCheck size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {adminCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Campus Deans & ERP Admins
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase' }}>
                  Departments
                </Typography>
                <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#FEF3C7', color: '#D97706' }}>
                  <Building2 size={18} />
                </Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                {departmentsCount}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Academic & Support Divisions
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter & Search Bar */}
      <Card
        sx={{
          p: 2.5,
          borderRadius: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by name, email, or contact number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={16} color="#64748B" />
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
          </Grid>

          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Role</InputLabel>
              <Select
                value={roleFilter}
                label="Role"
                onChange={(e) => setRoleFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Roles</MenuItem>
                <MenuItem value="TEACHER">Faculty (TEACHER)</MenuItem>
                <MenuItem value="ADMIN">Administrator (ADMIN)</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={6} md={3.5}>
            <FormControl fullWidth size="small">
              <InputLabel>Department</InputLabel>
              <Select
                value={deptFilter}
                label="Department"
                onChange={(e) => setDeptFilter(e.target.value)}
                sx={{ borderRadius: 2 }}
              >
                <MenuItem value="All">All Departments</MenuItem>
                {DEPARTMENTS.map((dept) => (
                  <MenuItem key={dept} value={dept}>
                    {dept}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Card>

      {/* Staff Directory Table */}
      <Card
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
          overflow: 'hidden',
        }}
      >
        {loading ? (
          <Box sx={{ p: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 2 }}>
            <CircularProgress size={32} />
            <Typography variant="body2" color="text.secondary">
              Loading staff records...
            </Typography>
          </Box>
        ) : filteredStaff.length === 0 ? (
          <Box sx={{ p: 6, textAlign: 'center' }}>
            <Users size={48} color="#94A3B8" style={{ margin: '0 auto 12px' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
              No Staff Records Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 450, mx: 'auto' }}>
              {searchTerm || roleFilter !== 'All' || deptFilter !== 'All'
                ? 'No staff members match the selected search and filter criteria.'
                : 'Get started by adding faculty members and administrative personnel to the institution directory.'}
            </Typography>
            <Button
              variant="contained"
              onClick={() => setAddModalOpen(true)}
              startIcon={<UserPlus size={16} />}
              sx={{
                bgcolor: '#4F46E5',
                '&:hover': { bgcolor: '#4338CA' },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
              }}
            >
              Add First Staff Member
            </Button>
          </Box>
        ) : (
          <TableContainer>
            <Table sx={{ minWidth: 700 }}>
              <TableHead sx={{ bgcolor: (t) => (t.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#F8FAFC') }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                    Staff Member
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                    Role & Designation
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                    Department
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                    Contact Phone
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                    Account Status
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: '0.75rem', textTransform: 'uppercase', color: 'text.secondary' }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStaff.map((member) => {
                  const initials = (member.name || 'Staff')
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase();

                  const isTeacher = member.role === 'TEACHER';

                  return (
                    <TableRow key={member._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              fontSize: '0.82rem',
                              fontWeight: 800,
                              bgcolor: isTeacher ? '#4F46E5' : '#1E6BFF',
                            }}
                          >
                            {initials}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              {member.name}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                              <Mail size={12} />
                              <Typography variant="caption">{member.email}</Typography>
                            </Box>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={isTeacher ? <GraduationCap size={13} /> : <ShieldCheck size={13} />}
                          label={isTeacher ? 'Faculty' : 'Administrator'}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            fontSize: '0.72rem',
                            bgcolor: isTeacher ? 'rgba(79, 70, 229, 0.1)' : 'rgba(30, 107, 255, 0.1)',
                            color: isTeacher ? '#4F46E5' : '#1E6BFF',
                            borderRadius: 1.5,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {member.department || 'General Administration'}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {member.phone ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            <Phone size={13} color="#64748B" />
                            <Typography variant="body2">{member.phone}</Typography>
                          </Box>
                        ) : (
                          <Typography variant="caption" color="text.secondary">
                            Not registered
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell>
                        <Chip
                          icon={<UserCheck size={13} />}
                          label="Active"
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ height: 22, fontSize: '0.68rem', fontWeight: 700 }}
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="Remove Staff Member">
                          <IconButton
                            size="small"
                            onClick={() => setDeleteConfirmId(member._id)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}
                          >
                            <Trash2 size={16} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      {/* Add Staff Member Dialog */}
      <Dialog
        open={addModalOpen}
        onClose={() => !submitting && setAddModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <form onSubmit={handleAddStaff}>
          <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
            Add New Staff Member
          </DialogTitle>
          <DialogContent sx={{ pt: 1.5 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
              Register teaching professors, department heads, or ERP administrative staff to grant portal access.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  label="Full Name"
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  type="email"
                  label="Institutional Email"
                  placeholder="e.g. ramesh.gupta@orbit.edu"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small">
                  <InputLabel>Role Assignment</InputLabel>
                  <Select
                    value={newStaff.role}
                    label="Role Assignment"
                    onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
                  >
                    <MenuItem value="TEACHER">Faculty (TEACHER)</MenuItem>
                    <MenuItem value="ADMIN">Administrator (ADMIN)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  placeholder="+91 98765 43210"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  size="small"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Department</InputLabel>
                  <Select
                    value={newStaff.department}
                    label="Department"
                    onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  >
                    {DEPARTMENTS.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  type="password"
                  label="Initial Password (Optional)"
                  placeholder="Defaults to Staff@2026 if blank"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  size="small"
                  helperText="The user will use this password to sign into the faculty/admin portal."
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1 }}>
            <Button
              onClick={() => setAddModalOpen(false)}
              disabled={submitting}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                bgcolor: '#4F46E5',
                '&:hover': { bgcolor: '#4338CA' },
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                px: 3,
              }}
            >
              {submitting ? 'Registering...' : 'Save & Register'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteConfirmId)}
        onClose={() => setDeleteConfirmId(null)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Confirm Staff Removal</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Are you sure you want to remove this staff member? Their portal access and teaching credentials will be revoked immediately.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteConfirmId(null)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteStaff(deleteConfirmId)}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
          >
            Remove Member
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffManagementPage;
