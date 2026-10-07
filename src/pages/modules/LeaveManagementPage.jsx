import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  CalendarX,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Send,
} from 'lucide-react';
import { api } from '../../services/api';

export const LeaveManagementPage = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  const [newLeave, setNewLeave] = useState({
    applicantName: 'Alex Parker',
    applicantRole: 'STUDENT',
    department: 'Computer Science & Engineering',
    leaveType: 'Casual Leave',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reason: '',
  });

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/leaves');
      if (res?.data) {
        setLeaves(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/leaves/${id}/status`, {
        status,
        approvedBy: 'Dr. Vikram Singhania (Director)',
      });
      fetchLeaves();
    } catch (err) {
      alert(err.message || 'Error updating leave status');
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!newLeave.reason) return;
    try {
      await api.post('/leaves', newLeave);
      setApplyModalOpen(false);
      setNewLeave({
        applicantName: 'Alex Parker',
        applicantRole: 'STUDENT',
        department: 'Computer Science & Engineering',
        leaveType: 'Casual Leave',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        reason: '',
      });
      fetchLeaves();
    } catch (err) {
      alert(err.message || 'Error submitting leave application');
    }
  };

  const filtered = leaves.filter((l) =>
    statusFilter === 'All' ? true : l.status === statusFilter
  );

  const pendingCount = leaves.filter((l) => l.status === 'Pending').length;
  const approvedCount = leaves.filter((l) => l.status === 'Approved').length;
  const rejectedCount = leaves.filter((l) => l.status === 'Rejected').length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <CalendarX size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Leave Management &amp; Approvals
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Faculty &amp; scholar leave applications, medical exceptions, and administrative sanction workflows.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setApplyModalOpen(true)}
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
          Apply for Leave
        </Button>
      </Box>

      {/* KPI Counters */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Requests</Typography>
                <CalendarX size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{leaves.length}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Recorded in database</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Pending Review</Typography>
                <Clock size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>{pendingCount}</Typography>
              <Typography variant="caption" sx={{ color: '#F59E0B', fontWeight: 600 }}>Action needed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Sanctioned / Approved</Typography>
                <CheckCircle size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>{approvedCount}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Leaves authorized</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Rejected</Typography>
                <XCircle size={20} color="#EF4444" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#EF4444' }}>{rejectedCount}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Denied requests</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
          <Chip
            key={status}
            label={status}
            clickable
            onClick={() => setStatusFilter(status)}
            sx={{
              fontWeight: 700,
              bgcolor: statusFilter === status ? '#1E6BFF' : '#FFFFFF',
              color: statusFilter === status ? '#FFFFFF' : '#475569',
              border: '1px solid',
              borderColor: statusFilter === status ? '#1E6BFF' : '#E2E8F0',
              '&:hover': {
                bgcolor: statusFilter === status ? '#174ED8' : '#F8FAFC',
              },
            }}
          />
        ))}
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

      {/* Leaves Table */}
      {!loading && !error && (
        <TableContainer component={Card} sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Applicant</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Leave Type</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Dates</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Reason</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Workflow Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((l) => {
                const isPending = l.status === 'Pending';
                const isApproved = l.status === 'Approved';
                return (
                  <TableRow key={l._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                        {l.applicantName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {l.department}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={l.applicantRole} size="small" sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 700 }} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                        {l.leaveType}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#475569', fontSize: '0.825rem' }}>
                        {new Date(l.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} — {new Date(l.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260 }}>
                      <Typography variant="body2" sx={{ color: '#64748B', fontSize: '0.825rem' }}>
                        {l.reason}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={l.status}
                        size="small"
                        sx={{
                          bgcolor: isApproved ? '#DCFCE7' : isPending ? '#FEF3C7' : '#FEE2E2',
                          color: isApproved ? '#166534' : isPending ? '#92400E' : '#DC2626',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {isPending ? (
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleUpdateStatus(l._id, 'Approved')}
                            sx={{
                              bgcolor: '#16A34A',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              '&:hover': { bgcolor: '#15803D' },
                            }}
                          >
                            Approve
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleUpdateStatus(l._id, 'Rejected')}
                            sx={{
                              borderColor: '#EF4444',
                              color: '#EF4444',
                              textTransform: 'none',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              '&:hover': { bgcolor: '#FEF2F2' },
                            }}
                          >
                            Reject
                          </Button>
                        </Box>
                      ) : (
                        <Typography variant="caption" sx={{ color: '#64748B' }}>
                          By {l.approvedBy || 'Director'}
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Apply Leave Modal */}
      <Dialog open={applyModalOpen} onClose={() => setApplyModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Submit Leave Application</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleApplyLeave} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Applicant Name"
              required
              size="small"
              fullWidth
              value={newLeave.applicantName}
              onChange={(e) => setNewLeave({ ...newLeave, applicantName: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={newLeave.applicantRole}
                    label="Role"
                    onChange={(e) => setNewLeave({ ...newLeave, applicantRole: e.target.value })}
                  >
                    <MenuItem value="STUDENT">Student</MenuItem>
                    <MenuItem value="TEACHER">Teacher / Faculty</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl size="small" fullWidth>
                  <InputLabel>Leave Type</InputLabel>
                  <Select
                    value={newLeave.leaveType}
                    label="Leave Type"
                    onChange={(e) => setNewLeave({ ...newLeave, leaveType: e.target.value })}
                  >
                    <MenuItem value="Casual Leave">Casual Leave</MenuItem>
                    <MenuItem value="Medical Leave">Medical Leave</MenuItem>
                    <MenuItem value="Duty Leave">Duty Leave</MenuItem>
                    <MenuItem value="Emergency Leave">Emergency Leave</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Start Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newLeave.startDate}
                  onChange={(e) => setNewLeave({ ...newLeave, startDate: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="End Date"
                  type="date"
                  size="small"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={newLeave.endDate}
                  onChange={(e) => setNewLeave({ ...newLeave, endDate: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              label="Reason for Absence"
              required
              fullWidth
              multiline
              rows={3}
              size="small"
              value={newLeave.reason}
              onChange={(e) => setNewLeave({ ...newLeave, reason: e.target.value })}
              placeholder="State legitimate academic, personal, or medical ground..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setApplyModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleApplyLeave}
            variant="contained"
            startIcon={<Send size={16} />}
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Submit Application
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeaveManagementPage;
