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
  Library as LibraryIcon,
  Search,
  Plus,
  Book,
  CheckCircle2,
  BookmarkCheck,
  MapPin,
  Layers,
} from 'lucide-react';
import { api } from '../../services/api';

export const LibraryPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    totalCopies: 5,
    locationShelf: 'Rack CS-05',
  });

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/library/books');
      if (res?.data) {
        setBooks(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load library catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleIssueBook = async (book) => {
    try {
      setSuccessMsg('');
      const res = await api.post('/library/issue', { bookId: book._id });
      setSuccessMsg(res?.message || `"${book.title}" successfully issued!`);
      fetchBooks();
    } catch (err) {
      alert(err.message || 'Error issuing book');
    }
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author) return;
    try {
      await api.post('/library/books', newBook);
      setAddModalOpen(false);
      setNewBook({
        title: '',
        author: '',
        isbn: '',
        category: 'Computer Science',
        totalCopies: 5,
        locationShelf: 'Rack CS-05',
      });
      fetchBooks();
    } catch (err) {
      alert(err.message || 'Failed to add book to catalog');
    }
  };

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalTitles = books.length;
  const totalCopies = books.reduce((acc, b) => acc + (b.totalCopies || 0), 0);
  const availableCopies = books.reduce((acc, b) => acc + (b.availableCopies || 0), 0);
  const issuedCopies = totalCopies - availableCopies;

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <LibraryIcon size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Digital Campus Library &amp; Circulation
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Book catalog search, shelf locator, digital copies, and circulation ledger.
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
          Add Title to Catalog
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
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Catalog Titles</Typography>
                <Book size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{totalTitles}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Indexed in MongoDB</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Total Physical Volumes</Typography>
                <Layers size={20} color="#8B5CF6" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6' }}>{totalCopies}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Total shelf copies</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Available for Issue</Typography>
                <CheckCircle2 size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>{availableCopies}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Ready on shelf</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Active Circulation</Typography>
                <BookmarkCheck size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>{issuedCopies}</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Currently with scholars</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Card sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
        <TextField
          size="small"
          placeholder="Search library catalog by title, author, or ISBN barcode..."
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

      {/* Catalog Table */}
      {!loading && !error && (
        <TableContainer component={Card} sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
          <Table>
            <TableHead sx={{ bgcolor: '#F8FAFC' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Title &amp; Author</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>ISBN</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700, color: '#475569' }}>Shelf Location</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700, color: '#475569' }}>Availability</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700, color: '#475569' }}>Circulation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((b) => {
                const isAvailable = (b.availableCopies || 0) > 0;
                return (
                  <TableRow key={b._id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#0F172A' }}>
                        {b.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#64748B' }}>
                        By {b.author}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#475569' }}>
                      {b.isbn}
                    </TableCell>
                    <TableCell>
                      <Chip label={b.category} size="small" sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 600 }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#475569', fontSize: '0.8rem' }}>
                        <MapPin size={14} color="#10B981" />
                        <span>{b.locationShelf || 'Main Stack'}</span>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${b.availableCopies} / ${b.totalCopies} Copies`}
                        size="small"
                        sx={{
                          bgcolor: isAvailable ? '#DCFCE7' : '#FEE2E2',
                          color: isAvailable ? '#15803D' : '#DC2626',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="contained"
                        disabled={!isAvailable}
                        onClick={() => handleIssueBook(b)}
                        sx={{
                          bgcolor: '#1E6BFF',
                          textTransform: 'none',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          borderRadius: 1.5,
                          '&:hover': { bgcolor: '#174ED8' },
                        }}
                      >
                        {isAvailable ? 'Issue Book' : 'Out of Stock'}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Book Modal */}
      <Dialog open={addModalOpen} onClose={() => setAddModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Add Title to University Catalog</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleAddBook} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Book Title"
              required
              fullWidth
              size="small"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <TextField
              label="Author(s)"
              required
              fullWidth
              size="small"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="ISBN Barcode"
                  fullWidth
                  size="small"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Category / Subject"
                  fullWidth
                  size="small"
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Total Stock Copies"
                  type="number"
                  fullWidth
                  size="small"
                  value={newBook.totalCopies}
                  onChange={(e) => setNewBook({ ...newBook, totalCopies: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Shelf Rack / Location"
                  fullWidth
                  size="small"
                  value={newBook.locationShelf}
                  onChange={(e) => setNewBook({ ...newBook, locationShelf: e.target.value })}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddBook}
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

export default LibraryPage;
