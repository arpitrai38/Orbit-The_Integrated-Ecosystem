export const getComponentOverrides = (mode = 'light') => {
  const isDark = mode === 'dark';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : '#E5EBF5';
  const subtleBg = isDark ? '#1E293B' : '#F8FAFC';

  return {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: isDark ? '#0B0F19' : '#F4F7FB', // Exact soft ice-slate background from screenshot
          color: isDark ? '#F8FAFC' : '#1E293B',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 18px',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        containedPrimary: {
          background: isDark
            ? 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)'
            : 'linear-gradient(135deg, #1E6BFF 0%, #1A56DB 100%)', // Vibrant blue from screenshot
          boxShadow: isDark
            ? '0 4px 14px 0 rgba(30, 107, 255, 0.4)'
            : '0 4px 14px 0 rgba(30, 107, 255, 0.25)',
          '&:hover': {
            background: isDark
              ? 'linear-gradient(135deg, #1D4ED8 0%, #1E40AF 100%)'
              : 'linear-gradient(135deg, #174ED8 0%, #1E40AF 100%)',
            boxShadow: isDark
              ? '0 6px 20px 0 rgba(30, 107, 255, 0.5)'
              : '0 6px 20px 0 rgba(30, 107, 255, 0.35)',
          },
        },
        outlined: {
          borderColor: borderColor,
          '&:hover': {
            borderColor: isDark ? '#60A5FA' : '#1E6BFF',
            backgroundColor: isDark ? 'rgba(59, 130, 246, 0.08)' : 'rgba(30, 107, 255, 0.04)',
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: `1px solid ${borderColor}`,
          backgroundColor: isDark ? '#111827' : '#FFFFFF',
          backgroundImage: 'none',
          boxShadow: isDark
            ? '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
            : '0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 2px 8px -2px rgba(15, 23, 42, 0.04)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        rounded: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${borderColor}`,
          color: isDark ? '#F8FAFC' : '#1E293B',
          boxShadow: 'none',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: isDark ? '#0F172A' : '#FFFFFF',
          borderRight: `1px solid ${borderColor}`,
          backgroundImage: 'none',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          backgroundColor: isDark ? 'rgba(17, 24, 39, 0.6)' : '#FFFFFF',
          '& fieldset': {
            borderColor: borderColor,
            transition: 'border-color 0.2s ease',
          },
          '&:hover fieldset': {
            borderColor: isDark ? '#60A5FA' : '#1E6BFF',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#1E6BFF',
            borderWidth: '1.5px',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 600,
          fontSize: '0.75rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: borderColor,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${borderColor}`,
          padding: '12px 16px',
        },
        head: {
          backgroundColor: subtleBg,
          fontWeight: 600,
          color: isDark ? '#94A3B8' : '#475569',
          fontSize: '0.8125rem',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        },
      },
    },
  };
};
