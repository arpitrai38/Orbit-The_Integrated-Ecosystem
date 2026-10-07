import React, { useEffect, useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { BusFront, MapPin, Navigation, Phone, RefreshCw, Timer, Users } from 'lucide-react';
import { api } from '../../services/api';
import { getLoggedInUser } from '../../utils/greeting';

export const TransportPage = () => {
  const user = getLoggedInUser();
  const [routes, setRoutes] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const refresh = async () => {
    setLoading(true);
    try { const res = await api.get('/transport'); setRoutes(res.data || []); if (!res.data?.length) setMessage('No transport routes added yet. Admin can add the first bus route from the transport registry.'); }
    catch { setMessage('Live GPS records will appear after the server is connected.'); }
    finally { setLoading(false); }
  };
  useEffect(() => { refresh(); }, []);
  const simulateLocation = async (route) => {
    const updated = { currentLocation: route.status === 'At Campus' ? 'Main Gate' : 'Campus Gate 2', speed: route.status === 'At Campus' ? 22 : 0, etaMinutes: route.status === 'At Campus' ? 7 : 0, status: route.status === 'At Campus' ? 'On Route' : 'At Campus' };
    try { const res = await api.patch(`/transport/${route._id}/location`, updated); setRoutes(items => items.map(item => item._id === route._id ? res.data : item)); }
    catch { setRoutes(items => items.map(item => item._id === route._id ? { ...item, ...updated, lastUpdated: new Date() } : item)); }
  };
  return <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
    <Box sx={{ display: 'flex', alignItems: { sm: 'center' }, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 3 }}><Box><Typography variant="h5" sx={{ fontWeight: 800 }}>Campus Transport Tracker</Typography><Typography variant="body2" color="text.secondary">Live vehicle status, arrival estimates and capacity for safer daily commutes.</Typography></Box><Button onClick={refresh} disabled={loading} startIcon={<RefreshCw size={16}/>} sx={{ textTransform: 'none' }}>Refresh location</Button></Box>
    {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}
    <Grid container spacing={2.5}>{routes.length === 0 && <Grid item xs={12}><Card sx={{ p: 4, borderRadius: 3, border: '1px dashed #CBD5E1', textAlign: 'center' }}><Typography sx={{ fontWeight: 700 }}>No vehicles registered</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Add your college bus routes, drivers and GPS device details to begin tracking.</Typography></Card></Grid>}{routes.map((route) => { const fill = route.capacity ? Math.round((route.occupiedSeats / route.capacity) * 100) : 0; const isDelayed = route.status === 'Delayed'; return <Grid item xs={12} md={6} key={route._id}><Card sx={{ border: '1px solid #E5EBF5', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ p: 2.5, background: 'linear-gradient(135deg, #EFF6FF, #F8FAFC)', display: 'flex', justifyContent: 'space-between' }}><Box sx={{ display: 'flex', gap: 1.5 }}><Box sx={{ p: 1, borderRadius: 2, bgcolor: '#1E6BFF', color: 'white', height: 40 }}><BusFront size={22}/></Box><Box><Typography sx={{ fontWeight: 800 }}>{route.routeCode} · {route.routeName}</Typography><Typography variant="caption" color="text.secondary">{route.vehicleNo} · Driver: {route.driverName}</Typography></Box></Box><Chip label={route.status} color={isDelayed ? 'warning' : route.status === 'On Route' ? 'success' : 'primary'} size="small" /></Box>
      <Box sx={{ p: 2.5 }}><Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}><MapPin size={18} color="#EF4444"/><Box><Typography variant="caption" color="text.secondary">Live location</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{route.currentLocation}</Typography></Box></Box>
      <Grid container spacing={1.5} sx={{ mb: 2 }}><Grid item xs={6}><Box sx={{ p: 1.2, bgcolor: '#F8FAFC', borderRadius: 2 }}><Typography variant="caption" color="text.secondary"><Timer size={13} /> Arrival estimate</Typography><Typography sx={{ fontWeight: 800 }}>{route.etaMinutes ? `${route.etaMinutes} min` : 'Arrived'}</Typography></Box></Grid><Grid item xs={6}><Box sx={{ p: 1.2, bgcolor: '#F8FAFC', borderRadius: 2 }}><Typography variant="caption" color="text.secondary"><Navigation size={13} /> Current speed</Typography><Typography sx={{ fontWeight: 800 }}>{route.speed} km/h</Typography></Box></Grid></Grid>
      <Box sx={{ mb: 2 }}><Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography variant="caption" color="text.secondary"><Users size={13}/> Seat occupancy</Typography><Typography variant="caption" sx={{ fontWeight: 700 }}>{route.occupiedSeats}/{route.capacity}</Typography></Box><LinearProgress variant="determinate" value={fill} color={fill > 85 ? 'warning' : 'primary'} sx={{ height: 7, borderRadius: 5, mt: .7 }} /></Box>
      <Box sx={{ display: 'flex', gap: 1, borderTop: '1px solid #E5EBF5', pt: 2 }}><Button size="small" startIcon={<Phone size={14}/>} href={`tel:${route.driverPhone}`} sx={{ textTransform: 'none' }}>Call driver</Button>{user.role === 'ADMIN' && <Button size="small" onClick={() => simulateLocation(route)} sx={{ textTransform: 'none' }}>Update GPS</Button>}</Box>
      </Box></Card></Grid>; })}</Grid>
  </Box>;
};
export default TransportPage;
