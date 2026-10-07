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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import {
  CreditCard,
  Search,
  Plus,
  CheckCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Receipt,
} from 'lucide-react';
import { api } from '../../services/api';

export const FeesPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Pay Modal State
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [payAmount, setPayAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI / NetBanking');

  // Generate Invoice Modal State
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    studentName: '',
    rollNo: '',
    title: 'Semester VII Tuition & Lab Fee',
    category: 'Tuition Fee',
    totalAmount: 85000,
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const fetchFees = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/fees');
      if (res?.data) {
        setFees(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load fee ledger from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  const handleOpenPay = (fee) => {
    setSelectedFee(fee);
    setPayAmount(fee.totalAmount - (fee.paidAmount || 0));
    setPayModalOpen(true);
  };

  const handleConfirmPayment = async (e) => {
    e.preventDefault();
    if (!selectedFee) return;
    try {
      setSuccessMsg('');
      const res = await api.post(`/fees/${selectedFee._id}/pay`, {
        amount: Number(payAmount),
        paymentMethod,
      });
      setSuccessMsg(res?.message || 'Payment recorded successfully in MongoDB!');
      setPayModalOpen(false);
      fetchFees();
    } catch (err) {
      alert(err.message || 'Payment processing error');
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!newInvoice.studentName || !newInvoice.rollNo) return;
    try {
      await api.post('/fees', newInvoice);
      setInvoiceModalOpen(false);
      setNewInvoice({
        studentName: '',
        rollNo: '',
        title: 'Semester VII Tuition & Lab Fee',
        category: 'Tuition Fee',
        totalAmount: 85000,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      fetchFees();
    } catch (err) {
      alert(err.message || 'Failed to create fee invoice');
    }
  };

  const filtered = fees.filter((f) => {
    const matchesSearch =
      f.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : f.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = fees.reduce((acc, f) => acc + (f.totalAmount || 0), 0);
  const totalCollected = fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
  const totalDue = totalInvoiced - totalCollected;
  const overdueCount = fees.filter((f) => f.status === 'Overdue').length;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <CreditCard size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Fee Ledger &amp; Revenue Collection
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Comprehensive accounts ledger, online collection gateway, dues monitoring, and receipts.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setInvoiceModalOpen(true)}
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
          Generate Fee Invoice
        </Button>
      </Box>

      {successMsg && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setSuccessMsg('')}>
          {successMsg}
        </Alert>
      )}

      {/* KPI Counters */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Invoiced</Typography>
                <DollarSign size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A' }}>
                ₹{totalInvoiced.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Institutional billings</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Collected Revenue</Typography>
                <CheckCircle size={20} color="#10B981" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#10B981' }}>
                ₹{totalCollected.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Realized receipts</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Outstanding Dues</Typography>
                <Clock size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#F59E0B' }}>
                ₹{totalDue.toLocaleString('en-IN')}
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Unpaid balances</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Overdue Notices</Typography>
                <AlertCircle size={20} color="#EF4444" />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: overdueCount > 0 ? '#EF4444' : '#10B981' }}>
                {overdueCount} Invoices
              </Typography>
              <Typography variant="caption" sx={{ color: overdueCount > 0 ? '#EF4444' : '#10B981', fontWeight: 600 }}>
                {overdueCount > 0 ? 'Follow-up required' : 'Zero default accounts'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filter and Search Bar */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <TextField
              size="small"
              placeholder="Search fee invoices by student name, roll number, or fee title..."
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
          <Grid item xs={12} md={4}>
            <FormControl size="small" fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
                <MenuItem value="All">All Invoices</MenuItem>
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
                <MenuItem value="Overdue">Overdue</MenuItem>
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

      {/* Fee Ledger Table */}
      {!loading && !error && (
        <TableContainer component={Card} sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Roll No</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Student Name</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Fee Head &amp; Category</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Total Billed</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Paid Amount</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Due Balance</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Due Date</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Status</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((f) => {
                const due = f.totalAmount - (f.paidAmount || 0);
                const isPaid = f.status === 'Paid';
                const isOverdue = f.status === 'Overdue';

                return (
                  <TableRow key={f._id} hover>
                    <TableCell sx={{ fontWeight: 700, color: '#1E6BFF' }}>
                      {f.rollNo}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700, color: '#0F172A' }}>
                      {f.studentName}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#334155' }}>
                        {f.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        {f.category} {f.transactionId && `• Txn: ${f.transactionId}`}
                      </Typography>
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>
                      ₹{f.totalAmount?.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell align="right" sx={{ color: '#16A34A', fontWeight: 700 }}>
                      ₹{f.paidAmount?.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell align="right" sx={{ color: due > 0 ? '#EF4444' : '#64748B', fontWeight: 700 }}>
                      ₹{due.toLocaleString('en-IN')}
                    </TableCell>
                    <TableCell sx={{ fontSize: '0.825rem', color: '#64748B' }}>
                      {new Date(f.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={f.status}
                        size="small"
                        sx={{
                          bgcolor: isPaid ? '#DCFCE7' : isOverdue ? '#FEE2E2' : '#FEF3C7',
                          color: isPaid ? '#166534' : isOverdue ? '#DC2626' : '#92400E',
                          fontWeight: 700,
                          borderRadius: 1.5,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {isPaid ? (
                        <Chip
                          icon={<Receipt size={13} />}
                          label="Receipt Generated"
                          size="small"
                          sx={{ bgcolor: '#F1F5F9', color: '#475569', fontWeight: 600 }}
                        />
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleOpenPay(f)}
                          sx={{
                            bgcolor: '#1E6BFF',
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '0.75rem',
                            borderRadius: 1.5,
                            '&:hover': { bgcolor: '#174ED8' },
                          }}
                        >
                          Collect / Pay
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Pay Modal */}
      <Dialog open={payModalOpen} onClose={() => setPayModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Record Fee Collection</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleConfirmPayment} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>Student Name &amp; Roll</Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A' }}>
                {selectedFee?.studentName} ({selectedFee?.rollNo})
              </Typography>
              <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mt: 1 }}>Outstanding Balance</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: '#EF4444' }}>
                ₹{(selectedFee?.totalAmount - (selectedFee?.paidAmount || 0)).toLocaleString('en-IN')}
              </Typography>
            </Box>

            <TextField
              label="Amount to Pay (₹)"
              type="number"
              required
              fullWidth
              size="small"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />

            <FormControl size="small" fullWidth>
              <InputLabel>Payment Channel</InputLabel>
              <Select
                value={paymentMethod}
                label="Payment Channel"
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <MenuItem value="UPI / NetBanking">UPI / NetBanking (Razorpay / BillDesk)</MenuItem>
                <MenuItem value="Credit/Debit Card">Credit / Debit Card</MenuItem>
                <MenuItem value="Campus Accounts Cash Desk">Campus Accounts Cash Desk</MenuItem>
                <MenuItem value="Bank Demand Draft">Bank Demand Draft (DD)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setPayModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmPayment}
            variant="contained"
            sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
          >
            Confirm &amp; Record Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Generate Invoice Modal */}
      <Dialog open={invoiceModalOpen} onClose={() => setInvoiceModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Generate Fee Bill / Invoice</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleCreateInvoice} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Roll Number"
                  required
                  fullWidth
                  size="small"
                  value={newInvoice.rollNo}
                  onChange={(e) => setNewInvoice({ ...newInvoice, rollNo: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Student Full Name"
                  required
                  fullWidth
                  size="small"
                  value={newInvoice.studentName}
                  onChange={(e) => setNewInvoice({ ...newInvoice, studentName: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              label="Fee Head Title"
              required
              fullWidth
              size="small"
              value={newInvoice.title}
              onChange={(e) => setNewInvoice({ ...newInvoice, title: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Fee Amount (₹)"
                  type="number"
                  required
                  fullWidth
                  size="small"
                  value={newInvoice.totalAmount}
                  onChange={(e) => setNewInvoice({ ...newInvoice, totalAmount: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Due Date"
                  type="date"
                  required
                  fullWidth
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={newInvoice.dueDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setInvoiceModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateInvoice}
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

export default FeesPage;
