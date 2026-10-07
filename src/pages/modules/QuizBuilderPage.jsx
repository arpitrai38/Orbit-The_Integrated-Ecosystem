import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import {
  Sparkles,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Award,
  HelpCircle,
  FileCheck,
} from 'lucide-react';
import { api } from '../../services/api';

export const QuizBuilderPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Create Quiz Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    courseCode: 'CS-401',
    courseName: 'Distributed Systems & Cloud Computing',
    durationMinutes: 15,
    difficulty: 'Medium',
    questions: [
      {
        question: 'What is the primary function of an ingress controller in Kubernetes?',
        options: [
          'Compiles container source code',
          'Routes external HTTP/HTTPS traffic to internal services',
          'Backs up the etcd database to cold storage',
          'Allocates physical RAM on bare-metal hypervisors',
        ],
        correctIndex: 1,
        explanation: 'Ingress exposes HTTP and HTTPS routes from outside the cluster to services within the cluster.',
        points: 5,
      },
      {
        question: 'Which consistency model ensures that once a value is read, no subsequent read by that process will return an earlier value?',
        options: [
          'Monotonic Read Consistency',
          'Eventual Consistency',
          'Weak Consistency',
          'Causal Memory Ordering',
        ],
        correctIndex: 0,
        explanation: 'Monotonic-read consistency guarantees that if a process reads the value of a data item x, any successive read on x by that process will always return that same value or a more recent value.',
        points: 5,
      },
    ],
  });

  // Interactive Quiz Taker Modal
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.get('/quizzes');
      if (res?.data) {
        setQuizzes(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load quizzes from MongoDB');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!newQuiz.title) return;
    try {
      await api.post('/quizzes', newQuiz);
      setCreateModalOpen(false);
      fetchQuizzes();
    } catch (err) {
      alert(err.message || 'Failed to create quiz');
    }
  };

  const handleStartTest = (quiz) => {
    setActiveQuiz(quiz);
    setUserAnswers({});
    setQuizResult(null);
    setTestModalOpen(true);
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;
    try {
      const res = await api.post(`/quizzes/${activeQuiz._id}/submit`, {
        answers: userAnswers,
      });
      if (res?.data) {
        setQuizResult(res.data);
      }
    } catch (err) {
      alert(err.message || 'Error evaluating quiz');
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 1400, mx: 'auto', width: '100%' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#EFF6FF', color: '#1E6BFF' }}>
              <Sparkles size={24} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              AI Assessment &amp; Quiz Builder
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: '#64748B' }}>
            Interactive question bank generation, adaptive difficulty evaluations, and automatic answer evaluation.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setCreateModalOpen(true)}
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
          Create New Quiz
        </Button>
      </Box>

      {/* KPI Counters */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Active Quizzes</Typography>
                <HelpCircle size={20} color="#1E6BFF" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#0F172A' }}>{quizzes.length}</Typography>
              <Typography variant="caption" sx={{ color: '#10B981', fontWeight: 600 }}>Ready for scholars</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Evaluation Engine</Typography>
                <Award size={20} color="#10B981" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#10B981' }}>Instant</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Auto-grading enabled</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Question Bank</Typography>
                <FileCheck size={20} color="#8B5CF6" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#8B5CF6' }}>
                {quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0)}
              </Typography>
              <Typography variant="caption" sx={{ color: '#8B5CF6', fontWeight: 600 }}>Questions indexed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 3, border: '1px solid #E5EBF5', boxShadow: 'none' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>AI Integration</Typography>
                <Sparkles size={20} color="#F59E0B" />
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 800, color: '#F59E0B' }}>ORBIT AI</Typography>
              <Typography variant="caption" sx={{ color: '#64748B' }}>Bloom's Taxonomy aligned</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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

      {/* Quizzes List */}
      {!loading && !error && (
        <Grid container spacing={2.5}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} md={6} key={quiz._id}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: '1px solid #E5EBF5',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    boxShadow: '0 8px 24px rgba(30, 107, 255, 0.08)',
                    borderColor: '#BFDBFE',
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Chip
                      label={quiz.courseCode}
                      sx={{ bgcolor: '#EFF6FF', color: '#1E6BFF', fontWeight: 800, borderRadius: 1.5 }}
                    />
                    <Chip
                      label={quiz.difficulty || 'Medium'}
                      size="small"
                      sx={{ bgcolor: '#FEF3C7', color: '#92400E', fontWeight: 700 }}
                    />
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 800, color: '#0F172A', mb: 1 }}>
                    {quiz.title}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#64748B', mb: 2 }}>
                    Course: <strong>{quiz.courseName}</strong> • Created by {quiz.createdBy}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2.5, bgcolor: '#F8FAFC', p: 1.5, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#475569', fontSize: '0.8rem' }}>
                      <Clock size={15} color="#1E6BFF" />
                      <span>{quiz.durationMinutes} Minutes</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#475569', fontSize: '0.8rem' }}>
                      <Award size={15} color="#10B981" />
                      <span>{quiz.totalMarks} Marks</span>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, color: '#475569', fontSize: '0.8rem' }}>
                      <HelpCircle size={15} color="#8B5CF6" />
                      <span>{quiz.questions?.length || 0} Questions</span>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<Play size={16} />}
                    onClick={() => handleStartTest(quiz)}
                    sx={{
                      bgcolor: '#1E6BFF',
                      textTransform: 'none',
                      fontWeight: 700,
                      borderRadius: 2,
                      py: 1,
                      boxShadow: '0 4px 12px rgba(30, 107, 255, 0.25)',
                      '&:hover': { bgcolor: '#174ED8' },
                    }}
                  >
                    Take Quiz / Test Mode
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Interactive Quiz Test Modal */}
      <Dialog open={testModalOpen} onClose={() => setTestModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800, pb: 1 }}>
          {activeQuiz?.title}
        </DialogTitle>
        <DialogContent dividers>
          {quizResult ? (
            <Box sx={{ py: 2 }}>
              <Box sx={{ textAlign: 'center', p: 3, mb: 3, borderRadius: 3, bgcolor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <CheckCircle2 size={44} color="#16A34A" style={{ marginBottom: 8 }} />
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#166534' }}>
                  {quizResult.score} / {quizResult.totalPossible} Marks ({quizResult.percentage}%)
                </Typography>
                <Typography variant="body2" sx={{ color: '#15803D', mt: 0.5 }}>
                  {quizResult.percentage >= 80 ? 'Outstanding performance! Mastery demonstrated.' : 'Good attempt! Review detailed explanations below.'}
                </Typography>
              </Box>

              <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2 }}>
                Question-by-Question Review:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {quizResult.review?.map((item, idx) => (
                  <Card key={idx} sx={{ p: 2, borderRadius: 2, border: item.isCorrect ? '1px solid #BBF7D0' : '1px solid #FECACA', bgcolor: item.isCorrect ? '#F0FDF4' : '#FEF2F2' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0F172A', mb: 1 }}>
                      Q{idx + 1}. {item.question}
                    </Typography>
                    <Typography variant="body2" sx={{ color: item.isCorrect ? '#166534' : '#991B1B', fontWeight: 600 }}>
                      {item.isCorrect ? '✓ Correct Answer' : '✗ Incorrect Answer'}
                    </Typography>
                    {item.explanation && (
                      <Typography variant="caption" sx={{ color: '#475569', display: 'block', mt: 0.8, bgcolor: 'rgba(255,255,255,0.7)', p: 1, borderRadius: 1.5 }}>
                        <strong>Explanation:</strong> {item.explanation}
                      </Typography>
                    )}
                  </Card>
                ))}
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, py: 1 }}>
              {activeQuiz?.questions?.map((q, idx) => (
                <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0F172A', mb: 1.5 }}>
                    {idx + 1}. {q.question}
                  </Typography>

                  <FormControl component="fieldset">
                    <RadioGroup
                      value={userAnswers[idx] !== undefined ? userAnswers[idx] : ''}
                      onChange={(e) => setUserAnswers({ ...userAnswers, [idx]: Number(e.target.value) })}
                    >
                      {q.options?.map((opt, optIdx) => (
                        <FormControlLabel
                          key={optIdx}
                          value={optIdx}
                          control={<Radio size="small" sx={{ color: '#1E6BFF' }} />}
                          label={<Typography variant="body2">{opt}</Typography>}
                        />
                      ))}
                    </RadioGroup>
                  </FormControl>
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setTestModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Close
          </Button>
          {!quizResult && (
            <Button
              onClick={handleSubmitQuiz}
              variant="contained"
              sx={{ bgcolor: '#1E6BFF', textTransform: 'none', fontWeight: 700 }}
            >
              Submit &amp; Evaluate Answers
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Create Quiz Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Publish New Assessment Quiz</DialogTitle>
        <DialogContent dividers>
          <Box component="form" onSubmit={handleCreateQuiz} sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Quiz Title"
              required
              fullWidth
              size="small"
              value={newQuiz.title}
              onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Course Code"
                  size="small"
                  fullWidth
                  value={newQuiz.courseCode}
                  onChange={(e) => setNewQuiz({ ...newQuiz, courseCode: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Time Limit (Minutes)"
                  type="number"
                  size="small"
                  fullWidth
                  value={newQuiz.durationMinutes}
                  onChange={(e) => setNewQuiz({ ...newQuiz, durationMinutes: e.target.value })}
                />
              </Grid>
            </Grid>
            <Typography variant="caption" sx={{ color: '#64748B' }}>
              Includes 2 pre-formulated university cloud systems questions with automated key scoring.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCreateModalOpen(false)} sx={{ color: '#64748B', textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateQuiz}
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

export default QuizBuilderPage;
