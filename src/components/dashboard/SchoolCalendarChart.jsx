import React, { useState, useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Trash2,
  X,
  CalendarDays,
} from 'lucide-react';
import { useThemeMode } from '../../hooks/useThemeMode';

const EVENT_CATEGORIES = [
  { id: 'event', label: 'Events', color: '#1E6BFF', bgLight: '#EFF6FF' },
  { id: 'holiday', label: 'School Holidays', color: '#EF4444', bgLight: '#FEF2F2' },
  { id: 'birthday', label: 'Birthdays', color: '#10B981', bgLight: '#ECFDF5' },
  { id: 'leave', label: 'Staff Leaves', color: '#F59E0B', bgLight: '#FFFBEB' },
  { id: 'exam', label: 'Exam Schedules', color: '#8B5CF6', bgLight: '#F5F3FF' },
];

const WEEK_DAYS = [
  { short: 'Sun', full: 'Sunday' },
  { short: 'Mon', full: 'Monday' },
  { short: 'Tue', full: 'Tuesday' },
  { short: 'Wed', full: 'Wednesday' },
  { short: 'Thu', full: 'Thursday' },
  { short: 'Fri', full: 'Friday' },
  { short: 'Sat', full: 'Saturday' },
];

export const SchoolCalendarChart = ({ title = 'School & College Calendar' }) => {
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  // Base calendar state - initialized to September 2026 (matching system date & user reference)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 29));
  const [calendarView, setCalendarView] = useState('month'); // 'month' | 'list'
  
  // Selected cell & Event Dialog state
  const [selectedCell, setSelectedCell] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventCategory, setNewEventCategory] = useState('event');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');

  // Academic events registry keyed by "YYYY-MM-DD"
  const [eventsMap, setEventsMap] = useState({
    '2026-09-05': [
      { id: 'ev-1', title: "Teachers' Day Felicitation", category: 'event', time: '09:30 AM' },
    ],
    '2026-09-12': [
      { id: 'ev-2', title: 'Mid-Term Examinations Begin', category: 'exam', time: '10:00 AM' },
    ],
    '2026-09-18': [
      { id: 'ev-3', title: "Principal Dr. Rao's Birthday", category: 'birthday', time: 'All Day' },
    ],
    '2026-09-24': [
      { id: 'ev-4', title: 'Faculty Medical Leave (3 Staff)', category: 'leave', time: 'Full Day' },
    ],
    '2026-09-29': [
      { id: 'ev-5', title: 'Orbit AI Innovation Summit', category: 'event', time: '11:00 AM' },
      { id: 'ev-6', title: 'Admissions Inquiry Open', category: 'event', time: '02:00 PM' },
    ],
    '2026-09-30': [
      { id: 'ev-7', title: 'Quarter-End Institutional Holiday', category: 'holiday', time: 'All Day' },
    ],
  });

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 8, 29));
  };

  // Helper to format date key YYYY-MM-DD
  const formatDateKey = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Build the complete grid of boxes with Day and Date
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 for Sunday
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const cells = [];

    // 1. Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDateNum = daysInPrevMonth - i;
      const cellDate = new Date(year, month - 1, prevDateNum);
      const dayOfWeekIndex = cellDate.getDay();
      const dateKey = formatDateKey(cellDate);

      cells.push({
        dayNum: prevDateNum,
        dayName: WEEK_DAYS[dayOfWeekIndex].short,
        fullDayName: WEEK_DAYS[dayOfWeekIndex].full,
        dateObj: cellDate,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === '2026-09-29',
        events: eventsMap[dateKey] || [],
      });
    }

    // 2. Current month days
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const cellDate = new Date(year, month, d);
      const dayOfWeekIndex = cellDate.getDay();
      const dateKey = formatDateKey(cellDate);

      cells.push({
        dayNum: d,
        dayName: WEEK_DAYS[dayOfWeekIndex].short,
        fullDayName: WEEK_DAYS[dayOfWeekIndex].full,
        dateObj: cellDate,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === '2026-09-29',
        events: eventsMap[dateKey] || [],
      });
    }

    // 3. Next month leading days (fill up to 35 or 42 cells)
    const totalCells = cells.length > 35 ? 42 : 35;
    const remaining = totalCells - cells.length;
    for (let nextD = 1; nextD <= remaining; nextD++) {
      const cellDate = new Date(year, month + 1, nextD);
      const dayOfWeekIndex = cellDate.getDay();
      const dateKey = formatDateKey(cellDate);

      cells.push({
        dayNum: nextD,
        dayName: WEEK_DAYS[dayOfWeekIndex].short,
        fullDayName: WEEK_DAYS[dayOfWeekIndex].full,
        dateObj: cellDate,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === '2026-09-29',
        events: eventsMap[dateKey] || [],
      });
    }

    return cells;
  }, [year, month, eventsMap]);

  // Open dialog to view or add events for clicked day
  const handleCellClick = (cell) => {
    setSelectedCell(cell);
    setNewEventTitle('');
    setDialogOpen(true);
  };

  // Add event handler
  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim() || !selectedCell) return;

    const newEv = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      category: newEventCategory,
      time: newEventTime,
    };

    setEventsMap((prev) => {
      const existing = prev[selectedCell.dateKey] || [];
      return {
        ...prev,
        [selectedCell.dateKey]: [...existing, newEv],
      };
    });

    setNewEventTitle('');
  };

  // Delete event handler
  const handleDeleteEvent = (dateKey, eventId) => {
    setEventsMap((prev) => {
      const existing = prev[dateKey] || [];
      return {
        ...prev,
        [dateKey]: existing.filter((ev) => ev.id !== eventId),
      };
    });
  };

  // Formatted Month Header string
  const monthYearString = currentDate.toLocaleString('default', {
    month: 'long',
    year: 'numeric',
  });

  const subtleBorder = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E2E8F0';
  const cardBg = isDark ? '#1E293B' : '#FFFFFF';

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1px solid ${subtleBorder}`,
        bgcolor: cardBg,
        overflow: 'hidden',
        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(30, 41, 59, 0.04)',
      }}
    >
      {/* 1. Blue Top Banner Header (Matching Image 3) */}
      <Box
        sx={{
          px: 2.5,
          py: 1.8,
          bgcolor: '#1E6BFF',
          color: '#FFFFFF',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 2,
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CalendarIcon size={18} color="#FFFFFF" />
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {title}
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85, fontSize: '0.68rem' }}>
              Academic Schedule, Holidays &amp; Campus Events Planner
            </Typography>
          </Box>
        </Box>

        {/* View Mode Toggle: Month | List */}
        <Stack
          direction="row"
          sx={{
            bgcolor: 'rgba(0, 0, 0, 0.18)',
            p: 0.4,
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <Button
            size="small"
            onClick={() => setCalendarView('month')}
            sx={{
              bgcolor: calendarView === 'month' ? '#FFFFFF' : 'transparent',
              color: calendarView === 'month' ? '#1E6BFF' : '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.74rem',
              textTransform: 'none',
              px: 1.8,
              py: 0.4,
              borderRadius: 1.5,
              boxShadow: calendarView === 'month' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              '&:hover': {
                bgcolor: calendarView === 'month' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            month
          </Button>
          <Button
            size="small"
            onClick={() => setCalendarView('list')}
            sx={{
              bgcolor: calendarView === 'list' ? '#FFFFFF' : 'transparent',
              color: calendarView === 'list' ? '#1E6BFF' : '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.74rem',
              textTransform: 'none',
              px: 1.8,
              py: 0.4,
              borderRadius: 1.5,
              boxShadow: calendarView === 'list' ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
              '&:hover': {
                bgcolor: calendarView === 'list' ? '#FFFFFF' : 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            list
          </Button>
        </Stack>
      </Box>

      {/* 2. Controls & Month Header Bar */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1.5,
          borderBottom: `1px solid ${subtleBorder}`,
        }}
      >
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Tooltip title="Previous Month">
            <IconButton
              size="small"
              onClick={handlePrevMonth}
              sx={{
                borderRadius: 2,
                border: `1px solid ${subtleBorder}`,
                color: 'text.primary',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
              }}
            >
              <ChevronLeft size={18} />
            </IconButton>
          </Tooltip>

          <Tooltip title="Next Month">
            <IconButton
              size="small"
              onClick={handleNextMonth}
              sx={{
                borderRadius: 2,
                border: `1px solid ${subtleBorder}`,
                color: 'text.primary',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : '#F1F5F9' },
              }}
            >
              <ChevronRight size={18} />
            </IconButton>
          </Tooltip>

          <Button
            size="small"
            variant="contained"
            onClick={handleToday}
            sx={{
              bgcolor: '#1E6BFF',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.76rem',
              textTransform: 'lowercase',
              px: 2,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(30, 107, 255, 0.25)',
              '&:hover': { bgcolor: '#174ED8' },
            }}
          >
            today
          </Button>
        </Stack>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '-0.015em',
            color: 'text.primary',
            textAlign: 'center',
          }}
        >
          {monthYearString}
        </Typography>

        <Chip
          label="Academic Session 2026-27"
          size="small"
          variant="outlined"
          sx={{
            fontWeight: 700,
            fontSize: '0.72rem',
            borderColor: isDark ? 'rgba(255,255,255,0.15)' : '#CBD5E1',
            color: 'text.secondary',
          }}
        />
      </Box>

      {/* 3. Main Calendar Chart View */}
      {calendarView === 'month' ? (
        <Box sx={{ p: 2 }}>
          {/* Calendar Grid Container (Real Chart Table with Row and Column Lines) */}
          <Box
            sx={{
              border: `1px solid ${subtleBorder}`,
              borderRadius: 2.5,
              overflow: 'hidden',
              bgcolor: isDark ? 'rgba(15, 23, 42, 0.4)' : '#FFFFFF',
            }}
          >
            {/* Header Column Names (Sun, Mon, Tue, Wed, Thu, Fri, Sat) */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                borderBottom: `1.5px solid ${subtleBorder}`,
              }}
            >
              {WEEK_DAYS.map((day, idx) => (
                <Box
                  key={day.short}
                  sx={{
                    py: 1.2,
                    textAlign: 'center',
                    borderRight: idx < 6 ? `1px solid ${subtleBorder}` : 'none',
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      letterSpacing: '0.04em',
                      color: idx === 0 || idx === 6 ? '#EF4444' : 'text.secondary',
                    }}
                  >
                    {day.short}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Calendar Day & Date Cells Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
              }}
            >
              {calendarGrid.map((cell, idx) => {
                const isRightEdge = (idx + 1) % 7 === 0;
                const isBottomEdge = idx >= calendarGrid.length - 7;

                // Image 3 highlight: today has soft yellow/amber background
                const todayBg = isDark ? 'rgba(245, 158, 11, 0.15)' : '#FFFBEB';
                const todayBorder = isDark ? '#F59E0B' : '#FCD34D';

                return (
                  <Box
                    key={`${cell.dateKey}-${idx}`}
                    onClick={() => handleCellClick(cell)}
                    sx={{
                      minHeight: { xs: 72, sm: 84, md: 94 },
                      p: { xs: 0.7, sm: 1 },
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      borderRight: isRightEdge ? 'none' : `1px solid ${subtleBorder}`,
                      borderBottom: isBottomEdge ? 'none' : `1px solid ${subtleBorder}`,
                      bgcolor: cell.isToday
                        ? todayBg
                        : cell.isCurrentMonth
                        ? 'transparent'
                        : isDark
                        ? 'rgba(255, 255, 255, 0.015)'
                        : '#FAFCFE',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease',
                      position: 'relative',
                      ...(cell.isToday && {
                        outline: `2px solid ${todayBorder}`,
                        outlineOffset: -2,
                        zIndex: 1,
                      }),
                      '&:hover': {
                        bgcolor: cell.isToday
                          ? todayBg
                          : isDark
                          ? 'rgba(255, 255, 255, 0.05)'
                          : '#F1F5F9',
                        '& .cell-add-icon': {
                          opacity: 1,
                        },
                      },
                    }}
                  >
                    {/* Top Row: DAY NAME & DATE NUMBER in every single box! */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 0.5,
                      }}
                    >
                      {/* Day Name Label inside box */}
                      <Typography
                        sx={{
                          fontSize: '0.64rem',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                          textTransform: 'uppercase',
                          color: cell.isToday
                            ? '#B45309'
                            : cell.isCurrentMonth
                            ? 'text.secondary'
                            : isDark
                            ? 'rgba(255,255,255,0.2)'
                            : '#94A3B8',
                        }}
                      >
                        {cell.dayName}
                      </Typography>

                      {/* Date Number Badge */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {cell.isToday && (
                          <Chip
                            label="TODAY"
                            size="small"
                            sx={{
                              height: 16,
                              fontSize: '0.55rem',
                              fontWeight: 900,
                              bgcolor: '#F59E0B',
                              color: '#FFFFFF',
                              px: 0.2,
                              borderRadius: '4px',
                            }}
                          />
                        )}
                        <Typography
                          sx={{
                            fontSize: cell.isToday ? '0.98rem' : '0.9rem',
                            fontWeight: cell.isToday ? 900 : 700,
                            lineHeight: 1,
                            color: cell.isToday
                              ? isDark
                                ? '#FBBF24'
                                : '#D97706'
                              : cell.isCurrentMonth
                              ? 'text.primary'
                              : isDark
                              ? 'rgba(255,255,255,0.2)'
                              : '#94A3B8',
                          }}
                        >
                          {cell.dayNum}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Middle: Events list or chips */}
                    <Box sx={{ my: 0.5, display: 'flex', flexDirection: 'column', gap: 0.4 }}>
                      {cell.events.slice(0, 2).map((ev) => {
                        const catMeta =
                          EVENT_CATEGORIES.find((c) => c.id === ev.category) ||
                          EVENT_CATEGORIES[0];
                        return (
                          <Box
                            key={ev.id}
                            sx={{
                              px: 0.6,
                              py: 0.2,
                              borderRadius: 1,
                              bgcolor: isDark
                                ? `${catMeta.color}25`
                                : catMeta.bgLight,
                              border: `1px solid ${catMeta.color}40`,
                              display: 'flex',
                              alignItems: 'center',
                              gap: 0.5,
                              minWidth: 0,
                            }}
                          >
                            <Box
                              sx={{
                                width: 5,
                                height: 5,
                                borderRadius: '50%',
                                bgcolor: catMeta.color,
                                flexShrink: 0,
                              }}
                            />
                            <Typography
                              noWrap
                              sx={{
                                fontSize: '0.62rem',
                                fontWeight: 700,
                                color: isDark ? '#FFFFFF' : catMeta.color,
                                lineHeight: 1.2,
                              }}
                            >
                              {ev.title}
                            </Typography>
                          </Box>
                        );
                      })}

                      {cell.events.length > 2 && (
                        <Typography
                          variant="caption"
                          sx={{
                            fontSize: '0.6rem',
                            fontWeight: 700,
                            color: 'text.secondary',
                            pl: 0.5,
                          }}
                        >
                          +{cell.events.length - 2} more
                        </Typography>
                      )}
                    </Box>

                    {/* Bottom Row: Quick Add Button Hint on Hover */}
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        height: 14,
                      }}
                    >
                      <Box
                        className="cell-add-icon"
                        sx={{
                          opacity: 0,
                          transition: 'opacity 0.15s ease',
                          display: 'flex',
                          alignItems: 'center',
                          color: '#1E6BFF',
                        }}
                      >
                        <Plus size={13} strokeWidth={2.5} />
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      ) : (
        /* 4. Agenda List View */
        <Box sx={{ p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1.5, color: 'text.secondary' }}>
            SCHEDULED EVENTS FOR {monthYearString.toUpperCase()}
          </Typography>

          <Stack spacing={1.5}>
            {Object.keys(eventsMap).sort().map((dateKey) => {
              const events = eventsMap[dateKey];
              if (!events || events.length === 0) return null;

              const dateObj = new Date(dateKey);
              const dayName = WEEK_DAYS[dateObj.getDay()].full;
              const formattedDate = dateObj.toLocaleDateString('default', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <Box
                  key={dateKey}
                  sx={{
                    p: 1.8,
                    borderRadius: 2.5,
                    border: `1px solid ${subtleBorder}`,
                    bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { sm: 'center' },
                    justifyContent: 'space-between',
                    gap: 1.5,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        minWidth: 54,
                        py: 0.8,
                        borderRadius: 2,
                        bgcolor: '#1E6BFF',
                        color: '#FFFFFF',
                        textAlign: 'center',
                      }}
                    >
                      <Typography sx={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase' }}>
                        {dayName.slice(0, 3)}
                      </Typography>
                      <Typography sx={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1 }}>
                        {dateObj.getDate()}
                      </Typography>
                    </Box>

                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                        {formattedDate} — {dayName}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                        {events.map((ev) => {
                          const catMeta =
                            EVENT_CATEGORIES.find((c) => c.id === ev.category) ||
                            EVENT_CATEGORIES[0];
                          return (
                            <Chip
                              key={ev.id}
                              label={`${ev.title} (${ev.time})`}
                              size="small"
                              sx={{
                                bgcolor: isDark ? `${catMeta.color}30` : catMeta.bgLight,
                                color: isDark ? '#FFFFFF' : catMeta.color,
                                fontWeight: 700,
                                fontSize: '0.72rem',
                                border: `1px solid ${catMeta.color}50`,
                              }}
                            />
                          );
                        })}
                      </Stack>
                    </Box>
                  </Box>

                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Plus size={14} />}
                    onClick={() => {
                      const cellDate = new Date(dateKey);
                      setSelectedCell({
                        dateKey,
                        dateObj: cellDate,
                        dayNum: cellDate.getDate(),
                        dayName: WEEK_DAYS[cellDate.getDay()].short,
                        fullDayName: WEEK_DAYS[cellDate.getDay()].full,
                        events,
                      });
                      setDialogOpen(true);
                    }}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 2 }}
                  >
                    Add Event
                  </Button>
                </Box>
              );
            })}
          </Stack>
        </Box>
      )}

      {/* 5. Color Coded Legend Bar (Matching Image 3) */}
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: { xs: 1.5, sm: 2.5 },
          borderTop: `1px solid ${subtleBorder}`,
          bgcolor: isDark ? 'rgba(0, 0, 0, 0.15)' : '#FAFCFF',
        }}
      >
        {EVENT_CATEGORIES.map((cat) => (
          <Box key={cat.id} sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: '50%',
                bgcolor: cat.color,
                boxShadow: `0 0 6px ${cat.color}60`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                fontSize: '0.75rem',
                color: 'text.secondary',
              }}
            >
              {cat.label}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* 6. Interactive Day Detail & Event Management Modal */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: cardBg,
            backgroundImage: 'none',
            border: `1px solid ${subtleBorder}`,
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarDays size={20} color="#1E6BFF" />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                {selectedCell ? `${selectedCell.fullDayName}, ${selectedCell.dayNum} ${monthYearString}` : 'Day Planner'}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Schedule campus activities, holidays, exams &amp; birthdays
              </Typography>
            </Box>
          </Box>
          <IconButton size="small" onClick={() => setDialogOpen(false)}>
            <X size={18} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: subtleBorder }}>
          {/* Current Events on this date */}
          <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.05em', color: 'text.secondary', mb: 1, display: 'block' }}>
            SCHEDULED ITEMS ON THIS DAY:
          </Typography>

          {selectedCell && (eventsMap[selectedCell.dateKey] || []).length === 0 ? (
            <Box
              sx={{
                p: 2.5,
                mb: 2.5,
                borderRadius: 2,
                border: `1px dashed ${subtleBorder}`,
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <Typography variant="body2">No events or leaves recorded for this date.</Typography>
            </Box>
          ) : (
            <Stack spacing={1} sx={{ mb: 2.5 }}>
              {selectedCell &&
                (eventsMap[selectedCell.dateKey] || []).map((ev) => {
                  const catMeta =
                    EVENT_CATEGORIES.find((c) => c.id === ev.category) ||
                    EVENT_CATEGORIES[0];

                  return (
                    <Box
                      key={ev.id}
                      sx={{
                        p: 1.2,
                        px: 1.6,
                        borderRadius: 2,
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
                        border: `1px solid ${subtleBorder}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: catMeta.color }} />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                            {ev.title}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Clock size={12} /> {ev.time} • {catMeta.label}
                          </Typography>
                        </Box>
                      </Box>

                      <IconButton
                        size="small"
                        onClick={() => handleDeleteEvent(selectedCell.dateKey, ev.id)}
                        sx={{ color: '#94A3B8', '&:hover': { color: '#EF4444' } }}
                      >
                        <Trash2 size={15} />
                      </IconButton>
                    </Box>
                  );
                })}
            </Stack>
          )}

          {/* Form to Add New Event */}
          <Box component="form" onSubmit={handleAddEvent}>
            <Typography variant="caption" sx={{ fontWeight: 800, letterSpacing: '0.05em', color: 'text.secondary', mb: 1.2, display: 'block' }}>
              ADD NEW SCHEDULE ENTRY:
            </Typography>

            <Stack spacing={1.8}>
              <TextField
                label="Event or Schedule Title"
                placeholder="e.g. Science Exhibition, Staff Meeting, Exam"
                size="small"
                fullWidth
                value={newEventTitle}
                onChange={(e) => setNewEventTitle(e.target.value)}
                required
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <TextField
                  select
                  label="Category Type"
                  size="small"
                  value={newEventCategory}
                  onChange={(e) => setNewEventCategory(e.target.value)}
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: cat.color }} />
                        <span>{cat.label}</span>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Time / Slot"
                  placeholder="e.g. 10:00 AM or All Day"
                  size="small"
                  value={newEventTime}
                  onChange={(e) => setNewEventTime(e.target.value)}
                />
              </Box>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Plus size={16} />}
                disabled={!newEventTitle.trim()}
                sx={{
                  bgcolor: '#1E6BFF',
                  fontWeight: 700,
                  borderRadius: 2,
                  py: 1,
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#174ED8' },
                }}
              >
                Add to Calendar
              </Button>
            </Stack>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)} sx={{ fontWeight: 700, textTransform: 'none' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SchoolCalendarChart;
