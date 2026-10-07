import React, { useState } from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AlertTriangle, BellRing, HeartPulse, PhoneCall, ShieldCheck } from 'lucide-react';

export const CampusSafetyPage = () => {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const sendSOS = () => { setSent(true); setMessage('SOS alert created. Campus security and the emergency contact workflow have been notified.'); };
  return <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1200, mx: 'auto', width: '100%' }}>
    <Typography variant="h5" sx={{ fontWeight: 800 }}>Campus Safety Centre</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>One place for emergency help, safety notices and campus incident reporting.</Typography>
    {sent && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
    <Grid container spacing={2.5}><Grid item xs={12} md={7}><Card sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 3, border: '1px solid #FECACA', bgcolor: '#FFF7F7' }}><AlertTriangle color="#DC2626" size={30}/><Typography variant="h5" sx={{ fontWeight: 800, mt: 1 }}>Emergency SOS</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>Send your current campus alert to security. Use only for urgent medical, safety or transport situations.</Typography><Button color="error" variant="contained" size="large" startIcon={<BellRing/>} onClick={sendSOS} sx={{ textTransform: 'none', fontWeight: 800 }}>Send emergency SOS</Button></Card></Grid>
    <Grid item xs={12} md={5}><Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5' }}><ShieldCheck color="#10B981"/><Typography sx={{ fontWeight: 800, mt: 1 }}>Safety contacts</Typography><Typography variant="body2" sx={{ mt: 1 }}>Campus Security: <strong>112 / +91 98765 10000</strong></Typography><Typography variant="body2" sx={{ mt: .6 }}>Medical Desk: <strong>+91 98765 10001</strong></Typography><Button href="tel:112" startIcon={<PhoneCall size={16}/>} sx={{ mt: 1.5, textTransform: 'none' }}>Call emergency services</Button></Card></Grid>
    <Grid item xs={12}><Card sx={{ p: 3, borderRadius: 3, border: '1px solid #E5EBF5' }}><Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 1 }}><HeartPulse color="#1E6BFF"/><Typography sx={{ fontWeight: 800 }}>Report a non-emergency incident</Typography><Chip label="Confidential" size="small" color="success" variant="outlined" /></Box><TextField multiline minRows={3} fullWidth placeholder="Share the location and a short description. This can be used for maintenance, harassment reporting, first aid, or other safety concerns." value={message} onChange={e => setMessage(e.target.value)} /><Button onClick={() => { if (message.trim()) { setSent(true); setMessage('Incident report submitted to the campus safety desk.'); } }} variant="outlined" sx={{ mt: 1.5, textTransform: 'none' }}>Submit report</Button></Card></Grid></Grid>
  </Box>;
};
export default CampusSafetyPage;
