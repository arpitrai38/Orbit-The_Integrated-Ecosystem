import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { ClipboardPlus, Inbox } from 'lucide-react';
import { ResponsiveContainer } from '../common/ResponsiveContainer';
import { ROUTES } from '../../routes/routeConfig';

export const RoleEmptyDashboard = ({ title, description, actionLabel, actionRoute }) => {
  const navigate = useNavigate();
  return <ResponsiveContainer><Box sx={{ py: { xs: 2, md: 4 } }}><Typography variant="h4" sx={{ fontWeight: 800 }}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{description}</Typography><Card sx={{ mt: 3, p: { xs: 3, sm: 5 }, textAlign: 'center', border: '1px dashed #CBD5E1', borderRadius: 3 }}><Inbox size={42} color="#1E6BFF"/><Typography variant="h6" sx={{ fontWeight: 800, mt: 1.5 }}>No records available yet</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 520, mx: 'auto' }}>This workspace intentionally starts empty. It will show only the courses, schedules, records and notices created by your institution.</Typography>{actionLabel && <Button variant="contained" startIcon={<ClipboardPlus size={17}/>} onClick={() => navigate(actionRoute || ROUTES.MODULES.CLASSES)} sx={{ mt: 2.5, bgcolor: '#1E6BFF', textTransform: 'none' }}>{actionLabel}</Button>}</Card></Box></ResponsiveContainer>;
};
export default RoleEmptyDashboard;
