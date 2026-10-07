import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { Bot, Send, X, Sparkles } from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';
import orbitAiBotImg from '../../assets/orbit_ai_bot.jpg';

export const OrbitAiChatWidget = () => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am ORBIT AI, your intelligent campus assistant. Ask me anything regarding classes, timetables, attendance, or ERP financial records.',
    },
  ]);

  const handleSendAiPrompt = (promptText) => {
    const textToSend = typeof promptText === 'string' ? promptText : aiPrompt;
    if (!textToSend || !textToSend.trim()) return;

    const userText = textToSend.trim();
    setAiMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setAiPrompt('');

    setTimeout(() => {
      let botResponse = 'Analyzing institutional records...';
      const lower = userText.toLowerCase();

      if (lower.includes('attendance')) {
        botResponse = 'Class 10A / Semester VII attendance is 94.8% today. 252 students absent across campus with verified automated SMS notices sent.';
      } else if (lower.includes('lesson') || lower.includes('plan')) {
        botResponse = 'AI Lesson Plan generated: "Distributed Consensus Algorithms" (CS-401) — 45-min lecture with 3 interactive checkpoints & lab viva questions.';
      } else if (lower.includes('class') || lower.includes('schedule') || lower.includes('time')) {
        botResponse = 'Next class: CS-401 - Cloud Computing in Room 205 with Prof. Ria (In progress now). Next free slot is 12:00 PM - 02:00 PM.';
      } else if (lower.includes('fee') || lower.includes('finance')) {
        botResponse = 'Fee Collections: ₹48,60,000 realized this month (78% of monthly target). ₹12,45,000 pending across 84 student ledgers.';
      } else if (lower.includes('risk') || lower.includes('student')) {
        botResponse = 'Student Risk Alert: 2 students in Semester VII have attendance below the 75% eligibility mark. Academic mentors have been notified.';
      } else {
        botResponse = `ORBIT AI has analyzed records for: "${userText}". Connected with institutional databases and academic ledgers in real-time.`;
      }

      setAiMessages((prev) => [...prev, { sender: 'bot', text: botResponse }]);
    }, 450);
  };

  return (
    <>
      {/* Floating Circular Robot Widget on Right Side */}
      <Box
        sx={{
          position: 'fixed',
          bottom: { xs: 20, sm: 28 },
          right: { xs: 20, sm: 28 },
          zIndex: 1400,
          display: 'flex',
          alignItems: 'center',
          gap: 1.2,
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => setAiModalOpen(true)}
      >
        {/* Sleek 'Ask Me' Capsule Badge */}
        <Box
          sx={{
            bgcolor: isDark ? '#1E293B' : '#FFFFFF',
            color: isDark ? '#F8FAFC' : '#0F172A',
            px: 1.6,
            py: 0.65,
            borderRadius: 4,
            fontWeight: 800,
            fontSize: '0.8rem',
            letterSpacing: '-0.01em',
            boxShadow: isDark
              ? '0 4px 16px rgba(0,0,0,0.45)'
              : '0 4px 16px rgba(0,0,0,0.1)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#E2E8F0'}`,
            display: { xs: 'none', sm: 'flex' },
            alignItems: 'center',
            gap: 0.8,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateX(-2px)',
              boxShadow: isDark
                ? '0 6px 20px rgba(0,0,0,0.6)'
                : '0 6px 20px rgba(0,0,0,0.15)',
            },
          }}
        >
          <Box
            sx={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              bgcolor: '#10B981',
              boxShadow: '0 0 8px rgba(16, 185, 129, 0.8)',
            }}
          />
          <Typography sx={{ fontWeight: 800, fontSize: '0.8rem', lineHeight: 1 }}>
            Ask Me
          </Typography>
        </Box>

        {/* Circular Robot Button */}
        <Tooltip title="Ask Orbit AI Assistant" placement="left" arrow>
          <Box
            sx={{
              width: { xs: 48, sm: 54 },
              height: { xs: 48, sm: 54 },
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1E6BFF 0%, #4F46E5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 6px 22px rgba(30, 107, 255, 0.45)',
              position: 'relative',
              transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'scale(1.08)',
                boxShadow: '0 8px 28px rgba(30, 107, 255, 0.6)',
              },
            }}
          >
            {/* Robot Head Icon */}
            <Bot size={26} strokeWidth={2.2} />

            {/* Glowing Accent Indicator */}
            <Box
              sx={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                bgcolor: '#10B981',
                border: '2px solid #FFFFFF',
              }}
            />
          </Box>
        </Tooltip>
      </Box>

      {/* Orbit AI Assistant Dialog with Smart Prompt Chips */}
      <Dialog
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 0.5,
            overflow: 'hidden',
            bgcolor: isDark ? '#1E293B' : '#FFFFFF',
            backgroundImage: 'none',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : '#E5EBF5'}`,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box
              component="img"
              src={orbitAiBotImg}
              alt="Orbit AI"
              sx={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #1E6BFF' }}
            />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                Orbit Campus AI Assistant
              </Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 700 }}>
                ● Real-time ERP Intelligence Active
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setAiModalOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ minHeight: 320, maxHeight: 440, overflowY: 'auto', p: 2 }}>
          {/* Quick Smart Prompt Buttons */}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mb: 2 }}>
            {[
              "Today's attendance stats",
              'Lesson plan for CS-401',
              'Fee collection progress',
              'Any students at academic risk?',
            ].map((quickQ) => (
              <Chip
                key={quickQ}
                label={quickQ}
                size="small"
                onClick={() => handleSendAiPrompt(quickQ)}
                icon={<Sparkles size={12} />}
                sx={{
                  cursor: 'pointer',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
                  '&:hover': { bgcolor: '#1E6BFF', color: '#FFFFFF' },
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {aiMessages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  p: 1.5,
                  borderRadius: 2.5,
                  bgcolor: msg.sender === 'user' ? '#1E6BFF' : isDark ? 'rgba(255, 255, 255, 0.06)' : '#F8FAFC',
                  color: msg.sender === 'user' ? '#FFFFFF' : isDark ? '#F8FAFC' : '#0F172A',
                  border: msg.sender === 'user' ? 'none' : `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
                  fontSize: '0.84rem',
                  lineHeight: 1.45,
                }}
              >
                {msg.text}
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 1.5, pt: 1 }}>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSendAiPrompt();
            }}
            sx={{ display: 'flex', width: '100%', gap: 1 }}
          >
            <TextField
              size="small"
              placeholder="Ask anything (e.g. attendance, syllabus, fees, schedules)..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              fullWidth
              autoFocus
              InputProps={{
                sx: { borderRadius: 2, fontSize: '0.84rem' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!aiPrompt.trim()}
              sx={{ minWidth: 44, px: 2, bgcolor: '#1E6BFF', borderRadius: 2 }}
            >
              <Send size={16} />
            </Button>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default OrbitAiChatWidget;
