import React, { useState, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  CalendarCheck,
  BookOpen,
  FileCheck,
  Sparkles,
  Award,
  Calendar,
  MessageSquare,
  Library,
  BarChart3,
  CalendarX,
  CreditCard,
  Settings,
  Search,
  X,
  Layers,
  BusFront,
  Video,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  LogOut,
} from 'lucide-react';

import { ROUTES } from '../../routes/routeConfig';
import { getLoggedInUser, logoutUser } from '../../utils/greeting';
import { useThemeMode } from '../../hooks/useThemeMode';

export const Sidebar = ({ onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { mode } = useThemeMode();
  const isDark = mode === 'dark';

  const user = getLoggedInUser('Administrator');
  const activeRole = user.role || 'ADMIN';

  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('ALL');
  const [collapsedSections, setCollapsedSections] = useState({});

  // Determine current role dashboard route
  const getDashboardPath = () => {
    if (location.pathname.startsWith('/admin')) return ROUTES.ADMIN.DASHBOARD;
    if (location.pathname.startsWith('/faculty')) return ROUTES.FACULTY.DASHBOARD;
    if (location.pathname.startsWith('/student')) return ROUTES.STUDENT.DASHBOARD;
    if (location.pathname.startsWith('/parent')) return ROUTES.PARENT.DASHBOARD;

    if (activeRole === 'ADMIN') return ROUTES.ADMIN.DASHBOARD;
    if (activeRole === 'STUDENT') return ROUTES.STUDENT.DASHBOARD;
    if (activeRole === 'PARENT') return ROUTES.PARENT.DASHBOARD;
    return ROUTES.FACULTY.DASHBOARD;
  };

  const toggleSection = (sectionKey) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleItemClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 900 && onClose) {
      onClose();
    }
  };

  // Structured multi-category menu items with roles & badges
  const navigationSections = useMemo(
    () => [
      {
        id: 'main',
        title: 'MAIN NAVIGATION',
        items: [
          {
            title: 'Dashboard',
            subtitle: 'Overview & Key Statistics',
            path: getDashboardPath(),
            icon: LayoutDashboard,
            roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            badge: 'Live',
            badgeColor: 'primary',
          },
          {
            title: 'Calendar & Timetable',
            subtitle: 'Day & Date Chart, Routine Planner',
            path: ROUTES.MODULES.TIMETABLE,
            icon: Calendar,
            roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
            badge: 'Chart',
            badgeColor: 'primary',
          },
          {
            title: 'Live Online Classes',
            subtitle: 'Real-time Virtual Lectures',
            path: ROUTES.MODULES.LIVE_CLASSES,
            icon: Video,
            roles: ['ADMIN', 'TEACHER', 'STUDENT'],
            badge: 'Active',
            badgeColor: 'error',
          },
        ],
      },
      {
        id: 'core_management',
        title: 'CORE MANAGEMENT',
        isHighlight: true,
        items: [
          {
            title: 'Staff Management',
            subtitle: 'Faculty & Administrative Staff',
            path: ROUTES.MODULES.STAFF,
            icon: Users,
            accentColor: '#6366F1',
            roles: ['ADMIN', 'TEACHER'],
            badge: 'Portal',
            badgeColor: 'primary',
          },
          {
            title: 'Student Management',
            subtitle: 'Admissions & Student Ledgers',
            path: ROUTES.MODULES.STUDENTS,
            icon: GraduationCap,
            accentColor: '#0EA5E9',
            roles: ['ADMIN', 'TEACHER'],
          },
          {
            title: 'Class Management',
            subtitle: 'Courses, Batches & Syllabi',
            path: ROUTES.MODULES.CLASSES,
            icon: BookOpen,
            accentColor: '#8B5CF6',
            roles: ['ADMIN', 'TEACHER', 'STUDENT'],
          },
          {
            title: 'Fee Management',
            subtitle: 'Invoices, Collections & Dues',
            path: ROUTES.MODULES.FEES,
            icon: CreditCard,
            accentColor: '#10B981',
            roles: ['ADMIN', 'STUDENT', 'PARENT'],
          },
          {
            title: 'Vehicles & Transport',
            subtitle: 'Live Fleet GPS & Transit Routes',
            path: ROUTES.MODULES.TRANSPORT,
            icon: BusFront,
            accentColor: '#F59E0B',
            roles: ['ADMIN', 'STUDENT', 'PARENT'],
            badge: 'GPS',
            badgeColor: 'default',
          },
        ],
      },
      {
        id: 'academics',
        title: 'ACADEMICS & LEARNING',
        items: [
          {
            title: 'Attendance Register',
            subtitle: 'Daily Roll-call & Reports',
            path: ROUTES.MODULES.ATTENDANCE,
            icon: CalendarCheck,
            roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          },
          {
            title: 'Lesson Plans & Syllabus',
            subtitle: 'Curriculum & Weekly Tracker',
            path: ROUTES.MODULES.LESSON_PLANS,
            icon: BookOpen,
            roles: ['ADMIN', 'TEACHER'],
          },
          {
            title: 'Assignments & Tasks',
            subtitle: 'Submissions & Deadlines',
            path: ROUTES.MODULES.ASSIGNMENTS,
            icon: FileCheck,
            roles: ['ADMIN', 'TEACHER', 'STUDENT'],
          },
          {
            title: 'AI Quiz & Exam Builder',
            subtitle: 'Automated Questions & Tests',
            path: ROUTES.MODULES.QUIZ_BUILDER,
            icon: Sparkles,
            roles: ['ADMIN', 'TEACHER'],
            badge: 'AI',
            badgeColor: 'primary',
          },
          {
            title: 'Results & Gradebook',
            subtitle: 'Mark sheets & Transcripts',
            path: ROUTES.MODULES.RESULTS,
            icon: Award,
            roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          },
          {
            title: 'Digital Library',
            subtitle: 'E-Books & Catalog Registry',
            path: ROUTES.MODULES.LIBRARY,
            icon: Library,
            roles: ['ADMIN', 'TEACHER', 'STUDENT'],
          },
        ],
      },
      {
        id: 'operations',
        title: 'CAMPUS OPERATIONS',
        items: [
          {
            title: 'Leave Management',
            subtitle: 'Faculty & Student Approvals',
            path: ROUTES.MODULES.LEAVES,
            icon: CalendarX,
            roles: ['ADMIN', 'TEACHER', 'STUDENT'],
          },
          {
            title: 'Campus Safety & SOS',
            subtitle: 'Emergency Hotlines & Protocols',
            path: ROUTES.MODULES.CAMPUS_SAFETY,
            icon: ShieldCheck,
            roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          },
          {
            title: 'Reports & Analytics',
            subtitle: 'Performance & Metric Ledgers',
            path: ROUTES.MODULES.REPORTS,
            icon: BarChart3,
            roles: ['ADMIN', 'TEACHER'],
          },
        ],
      },
      {
        id: 'system',
        title: 'COMMUNICATION & SYSTEM',
        items: [
          {
            title: 'Notice Board & Circulars',
            subtitle: 'Campus Announcements',
            path: ROUTES.MODULES.COMMUNICATION,
            icon: MessageSquare,
            roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          },
          {
            title: 'System Settings',
            subtitle: 'Configurations & Access Rules',
            path: ROUTES.MODULES.SETTINGS,
            icon: Settings,
            roles: ['ADMIN', 'TEACHER', 'STUDENT', 'PARENT'],
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.pathname, activeRole]
  );

  // Filter items matching role, search keyword, and active category tab
  const filteredSections = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return navigationSections
      .filter((section) => {
        if (activeCategoryFilter === 'ALL') return true;
        if (activeCategoryFilter === 'CORE') return section.id === 'core_management' || section.id === 'main';
        if (activeCategoryFilter === 'ACADEMICS') return section.id === 'academics';
        if (activeCategoryFilter === 'OPERATIONS') return section.id === 'operations' || section.id === 'system';
        return true;
      })
      .map((section) => {
        const matchingItems = section.items.filter((item) => {
          const hasRole = item.roles.includes(activeRole);
          const matchesSearch =
            !query ||
            item.title.toLowerCase().includes(query) ||
            (item.subtitle && item.subtitle.toLowerCase().includes(query));
          return hasRole && matchesSearch;
        });
        return {
          ...section,
          items: matchingItems,
        };
      })
      .filter((section) => section.items.length > 0);
  }, [navigationSections, searchTerm, activeRole, activeCategoryFilter]);

  const userInitials = (user.name || 'User')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const roleThemeColor =
    activeRole === 'ADMIN'
      ? '#1E6BFF'
      : activeRole === 'TEACHER'
      ? '#4F46E5'
      : activeRole === 'STUDENT'
      ? '#10B981'
      : '#F59E0B';

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDark ? '#0F172A' : '#FFFFFF',
        borderRight: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5EBF5'}`,
        userSelect: 'none',
      }}
    >
      {/* 1. Brand Logo Header */}
      <Box sx={{ p: 2, pb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component={NavLink}
          to="/"
          onClick={handleItemClick}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.2,
            p: 1.2,
            px: 1.6,
            borderRadius: 2.5,
            bgcolor: roleThemeColor,
            color: '#FFFFFF',
            textDecoration: 'none',
            flexGrow: 1,
            boxShadow: `0 4px 14px ${roleThemeColor}40`,
            transition: 'all 0.2s ease',
            '&:hover': {
              filter: 'brightness(1.08)',
              transform: 'translateY(-1px)',
            },
          }}
        >
          <Box
            sx={{
              width: 30,
              height: 30,
              borderRadius: 1.8,
              bgcolor: 'rgba(255, 255, 255, 0.22)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Layers size={18} color="#FFFFFF" />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '0.88rem', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
              ORBIT AI ERP
            </Typography>
            <Typography sx={{ fontSize: '0.62rem', fontWeight: 600, opacity: 0.9, letterSpacing: '0.04em' }}>
              INTEGRATED LMS &amp; ERP
            </Typography>
          </Box>
        </Box>

        {onClose && (
          <Tooltip title="Close Sidebar" arrow>
            <IconButton
              size="small"
              onClick={onClose}
              sx={{
                width: 34,
                height: 34,
                borderRadius: 2,
                color: isDark ? '#94A3B8' : '#64748B',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#E2E8F0'}`,
                '&:hover': {
                  bgcolor: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                  color: isDark ? '#FFFFFF' : '#0F172A',
                },
              }}
            >
              <X size={18} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* 2. Mini Profile Badge with Role Switcher */}
      <Box sx={{ px: 2, pb: 1.2 }}>
        <Box
          sx={{
            p: 1.2,
            borderRadius: 2,
            bgcolor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#F8FAFC',
            border: `1px solid ${isDark ? 'rgba(255, 255, 255, 0.06)' : '#E5EBF5'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 0 }}>
            <Avatar
              sx={{
                width: 28,
                height: 28,
                fontSize: '0.72rem',
                fontWeight: 800,
                bgcolor: roleThemeColor,
                color: '#FFFFFF',
              }}
            >
              {userInitials || 'OB'}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="body2"
                noWrap
                sx={{
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  lineHeight: 1.2,
                  color: isDark ? '#F8FAFC' : '#0F172A',
                }}
              >
                {user.name}
              </Typography>
              <Typography
                variant="caption"
                noWrap
                sx={{
                  fontSize: '0.65rem',
                  color: 'text.secondary',
                  display: 'block',
                }}
              >
                {activeRole} • {user.department ? user.department.split('&')[0] : 'Campus'}
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Logout">
            <IconButton
              size="small"
              onClick={() => {
                logoutUser();
                navigate(ROUTES.AUTH.LOGIN);
              }}
              sx={{
                width: 28,
                height: 28,
                borderRadius: 1.8,
                color: '#EF4444',
                bgcolor: isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.06)',
                border: `1px solid ${isDark ? 'rgba(239, 68, 68, 0.25)' : 'rgba(239, 68, 68, 0.18)'}`,
                transition: 'all 0.18s ease',
                '&:hover': {
                  color: '#DC2626',
                  bgcolor: 'rgba(239, 68, 68, 0.18)',
                  borderColor: '#EF4444',
                  transform: 'scale(1.06)',
                },
              }}
            >
              <LogOut size={15} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* 3. Search Navigation Filter */}
      <Box sx={{ px: 2, pb: 1 }}>
        <TextField
          size="small"
          placeholder="Search navigation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={14} color={isDark ? '#64748B' : '#94A3B8'} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ p: 0.2 }}>
                  <X size={13} />
                </IconButton>
              </InputAdornment>
            ) : null,
            sx: {
              fontSize: '0.78rem',
              borderRadius: 2,
              bgcolor: isDark ? 'rgba(255, 255, 255, 0.02)' : '#F8FAFC',
              '& fieldset': { borderColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5EBF5' },
              '&:hover fieldset': { borderColor: roleThemeColor },
            },
          }}
        />
      </Box>

      {/* 3b. Interactive Quick Filter Category Tabs */}
      <Box
        sx={{
          px: 1.8,
          pb: 1.2,
          display: 'flex',
          gap: 0.7,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { display: 'none' },
          msOverflowStyle: 'none',
          scrollbarWidth: 'none',
        }}
      >
        {[
          { id: 'ALL', label: 'All Modules' },
          { id: 'CORE', label: 'Core (5)', dot: '#6366F1' },
          { id: 'ACADEMICS', label: 'Academics (6)' },
          { id: 'OPERATIONS', label: 'Operations (5)' },
        ].map((cat) => {
          const isSelected = activeCategoryFilter === cat.id;
          return (
            <Box
              key={cat.id}
              onClick={() => setActiveCategoryFilter(cat.id)}
              sx={{
                px: 1.2,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.68rem',
                fontWeight: isSelected ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                bgcolor: isSelected
                  ? roleThemeColor
                  : isDark
                  ? 'rgba(255, 255, 255, 0.04)'
                  : '#F1F5F9',
                color: isSelected ? '#FFFFFF' : isDark ? '#94A3B8' : '#475569',
                border: isSelected
                  ? `1px solid ${roleThemeColor}`
                  : `1px solid ${isDark ? 'rgba(255, 255, 255, 0.07)' : '#E2E8F0'}`,
                boxShadow: isSelected ? `0 2px 10px ${roleThemeColor}40` : 'none',
                '&:hover': {
                  bgcolor: isSelected
                    ? roleThemeColor
                    : isDark
                    ? 'rgba(255, 255, 255, 0.08)'
                    : '#E2E8F0',
                  color: isSelected ? '#FFFFFF' : isDark ? '#F1F5F9' : '#0F172A',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'scale(0.96)',
                },
              }}
            >
              {cat.dot && (
                <Box
                  sx={{
                    width: 5.5,
                    height: 5.5,
                    borderRadius: '50%',
                    bgcolor: isSelected ? '#FFFFFF' : cat.dot,
                    boxShadow: isSelected ? '0 0 6px #FFFFFF' : 'none',
                  }}
                />
              )}
              {cat.label}
            </Box>
          );
        })}
      </Box>

      {/* 4. Categorized Navigation List */}
      <Box
        sx={{
          flexGrow: 1,
          px: 1.5,
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': {
            background: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
            borderRadius: '4px',
          },
        }}
      >
        <List disablePadding>
          {filteredSections.map((section) => {
            const isCollapsed = Boolean(collapsedSections[section.id]);
            const isHighlight = Boolean(section.isHighlight);

            return (
              <Box key={section.id} sx={{ mb: 2 }}>
                {/* Section Header with Expand/Collapse & Item Count */}
                <Box
                  onClick={() => toggleSection(section.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 1.2,
                    py: 0.7,
                    mb: 0.9,
                    cursor: 'pointer',
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        bgcolor: isHighlight
                          ? '#6366F1'
                          : isDark
                          ? '#475569'
                          : '#94A3B8',
                        boxShadow: isHighlight
                          ? '0 0 8px rgba(99, 102, 241, 0.7)'
                          : 'none',
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 800,
                        fontSize: '0.675rem',
                        letterSpacing: '0.07em',
                        color: isHighlight
                          ? isDark
                            ? '#A5B4FC'
                            : '#4338CA'
                          : isDark
                          ? '#94A3B8'
                          : '#64748B',
                        textTransform: 'uppercase',
                      }}
                    >
                      {section.title}
                    </Typography>
                    <Box
                      sx={{
                        px: 0.7,
                        py: 0.1,
                        borderRadius: '10px',
                        fontSize: '0.62rem',
                        fontWeight: 700,
                        bgcolor: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
                        color: isDark ? '#94A3B8' : '#64748B',
                      }}
                    >
                      {section.items.length}
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      color: isDark ? '#64748B' : '#94A3B8',
                    }}
                  >
                    <ChevronDown size={14} />
                  </Box>
                </Box>

                {/* Section Items with Tactile Spacing & Hover Feedback */}
                {!isCollapsed &&
                  section.items.map((item) => {
                    const Icon = item.icon;
                    const isDashboard = item.title === 'Dashboard';
                    const isActive = isDashboard
                      ? location.pathname.includes('/dashboard')
                      : location.pathname === item.path;

                    const accent = item.accentColor || roleThemeColor;

                    return (
                      <ListItem key={item.title} disablePadding sx={{ mb: 0.9 }}>
                        <ListItemButton
                          component={NavLink}
                          to={item.path}
                          onClick={handleItemClick}
                          sx={{
                            borderRadius: 2.5,
                            py: item.subtitle ? 0.95 : 0.85,
                            px: 1.3,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.25,
                            border: isDark
                              ? isActive
                                ? `1.5px solid ${accent}60`
                                : '1px solid rgba(255, 255, 255, 0.05)'
                              : isActive
                              ? `1.5px solid ${accent}45`
                              : '1px solid #EEF2F6',
                            background: isActive
                              ? isDark
                                ? `linear-gradient(135deg, ${accent}22 0%, rgba(15, 23, 42, 0.8) 100%)`
                                : `linear-gradient(135deg, ${accent}12 0%, #FFFFFF 100%)`
                              : isDark
                              ? 'rgba(255, 255, 255, 0.02)'
                              : '#FFFFFF',
                            boxShadow: isActive
                              ? isDark
                                ? `0 4px 14px ${accent}25`
                                : `0 4px 14px ${accent}18`
                              : isDark
                              ? 'none'
                              : '0 1px 3px rgba(0, 0, 0, 0.02)',
                            transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                            '&:hover': {
                              background: isActive
                                ? isDark
                                  ? `linear-gradient(135deg, ${accent}30 0%, rgba(15, 23, 42, 0.9) 100%)`
                                  : `linear-gradient(135deg, ${accent}18 0%, #F8FAFC 100%)`
                                : isDark
                                ? 'rgba(255, 255, 255, 0.06)'
                                : '#F8FAFC',
                              borderColor: isDark ? `${accent}70` : `${accent}50`,
                              transform: 'translateX(4px)',
                              boxShadow: isDark
                                ? `0 4px 16px rgba(0,0,0,0.4)`
                                : `0 4px 16px ${accent}22`,
                              '& .nav-icon-chip': {
                                transform: 'scale(1.1) rotate(-3deg)',
                                boxShadow: `0 4px 12px ${accent}40`,
                              },
                              '& .nav-chevron': {
                                opacity: 1,
                                transform: 'translateX(2px)',
                                color: accent,
                              },
                            },
                            '&:active': {
                              transform: 'scale(0.978) translateX(2px)',
                            },
                          }}
                        >
                          {/* Styled Icon Container Chip with Dynamic Hover Micro-interaction */}
                          <Box
                            className="nav-icon-chip"
                            sx={{
                              width: 34,
                              height: 34,
                              borderRadius: 2.2,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                              bgcolor: isActive
                                ? accent
                                : isDark
                                ? item.accentColor
                                  ? `${item.accentColor}25`
                                  : 'rgba(255, 255, 255, 0.05)'
                                : item.accentColor
                                ? `${item.accentColor}15`
                                : '#F1F5F9',
                              color: isActive
                                ? '#FFFFFF'
                                : item.accentColor || (isDark ? '#94A3B8' : '#64748B'),
                              boxShadow: isActive ? `0 4px 12px ${accent}50` : 'none',
                            }}
                          >
                            <Icon size={17} strokeWidth={isActive ? 2.3 : 1.9} />
                          </Box>

                          {/* Text Title & Subtitle with Active Indicator */}
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                              <Typography
                                sx={{
                                  fontSize: '0.84rem',
                                  fontWeight: isActive ? 800 : 600,
                                  lineHeight: 1.25,
                                  letterSpacing: '-0.015em',
                                  color: isActive
                                    ? isDark
                                      ? '#93C5FD'
                                      : '#1D4ED8'
                                    : isDark
                                    ? '#E2E8F0'
                                    : '#1E293B',
                                }}
                                noWrap
                              >
                                {item.title}
                              </Typography>
                              {isActive && (
                                <Box
                                  sx={{
                                    width: 6,
                                    height: 6,
                                    borderRadius: '50%',
                                    bgcolor: accent,
                                    boxShadow: `0 0 8px ${accent}`,
                                    flexShrink: 0,
                                  }}
                                />
                              )}
                            </Box>
                            {item.subtitle && (
                              <Typography
                                sx={{
                                  fontSize: '0.65rem',
                                  fontWeight: 500,
                                  lineHeight: 1.15,
                                  letterSpacing: '0.005em',
                                  color: isActive
                                    ? isDark
                                      ? '#60A5FA'
                                      : '#2563EB'
                                    : isDark
                                    ? '#94A3B8'
                                    : '#64748B',
                                  mt: 0.3,
                                }}
                                noWrap
                              >
                                {item.subtitle}
                              </Typography>
                            )}
                          </Box>

                          {/* Live Status or Counter Badge */}
                          {item.badge && (
                            <Chip
                              label={item.badge}
                              size="small"
                              color={item.badgeColor || 'default'}
                              sx={{
                                height: 18,
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                px: 0.3,
                                borderRadius: '4px',
                                ...(item.badge === 'Active' || item.badge === 'Live'
                                  ? {
                                      bgcolor: 'rgba(239, 68, 68, 0.12)',
                                      color: '#EF4444',
                                      border: '1px solid rgba(239, 68, 68, 0.25)',
                                    }
                                  : item.badge === 'GPS'
                                  ? {
                                      bgcolor: 'rgba(245, 158, 11, 0.12)',
                                      color: '#D97706',
                                      border: '1px solid rgba(245, 158, 11, 0.25)',
                                    }
                                  : item.badge === 'Portal'
                                  ? {
                                      bgcolor: 'rgba(99, 102, 241, 0.12)',
                                      color: '#6366F1',
                                      border: '1px solid rgba(99, 102, 241, 0.25)',
                                    }
                                  : {}),
                              }}
                            />
                          )}

                          {/* Interactive Navigation Arrow Indicator */}
                          <Box
                            className="nav-chevron"
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              color: isActive ? accent : isDark ? '#475569' : '#94A3B8',
                              opacity: isActive ? 1 : 0.4,
                              transform: isActive ? 'translateX(0)' : 'translateX(-3px)',
                              transition: 'all 0.2s ease',
                              flexShrink: 0,
                            }}
                          >
                            <ChevronRight size={14} strokeWidth={2.4} />
                          </Box>
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
              </Box>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
