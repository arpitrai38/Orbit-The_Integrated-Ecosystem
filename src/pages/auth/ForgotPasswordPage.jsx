import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

import { AppButton } from '../../components/common/AppButton';
import { ROUTES } from '../../routes/routeConfig';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <Card
      sx={{
        width: '100%',
        maxWidth: 440,
        boxShadow: (theme) =>
          theme.palette.mode === 'dark'
            ? '0 20px 40px -10px rgba(0,0,0,0.7)'
            : '0 20px 40px -10px rgba(79, 70, 229, 0.12)',
      }}
    >
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: (theme) =>
                theme.palette.mode === 'dark' ? 'rgba(79,70,229,0.2)' : 'rgba(79,70,229,0.1)',
              color: 'primary.main',
              mb: 2,
            }}
          >
            <KeyRound size={24} />
          </Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Reset Password
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Enter your institutional email to receive recovery instructions.
          </Typography>
        </Box>

        {submitted ? (
          <Box sx={{ textAlign: 'center' }}>
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2, textAlign: 'left' }}>
              If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
            </Alert>
            <AppButton
              component={NavLink}
              to={ROUTES.AUTH.LOGIN}
              variant="outlined"
              fullWidth
            >
              Return to Login
            </AppButton>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <TextField
              label="Institutional Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. yourname@orbit.edu"
              required
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={18} color="#94A3B8" />
                  </InputAdornment>
                ),
              }}
            />

            <AppButton
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              loading={loading}
              fullWidth
            >
              Send Reset Link
            </AppButton>

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography
                component={NavLink}
                to={ROUTES.AUTH.LOGIN}
                variant="body2"
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 0.75,
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontWeight: 500,
                  '&:hover': { color: 'primary.main' },
                }}
              >
                <ArrowLeft size={16} />
                Back to Sign In
              </Typography>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordPage;
