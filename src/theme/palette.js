export const brandColors = {
  primary: {
    main: '#1E6BFF', // EduNova/ORBIT Vibrant Royal Blue from Screenshot
    light: '#60A5FA',
    dark: '#174ED8',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#06B6D4', // Sky Cyan
    light: '#38BDF8',
    dark: '#0284C7',
    contrastText: '#FFFFFF',
  },
  success: {
    main: '#10B981', // Emerald
    light: '#34D399',
    dark: '#059669',
    contrastText: '#FFFFFF',
  },
  warning: {
    main: '#F59E0B', // Amber
    light: '#FBBF24',
    dark: '#D97706',
    contrastText: '#FFFFFF',
  },
  error: {
    main: '#EF4444', // Rose Red
    light: '#F87171',
    dark: '#DC2626',
    contrastText: '#FFFFFF',
  },
  info: {
    main: '#3B82F6', // Blue
    light: '#93C5FD',
    dark: '#1D4ED8',
    contrastText: '#FFFFFF',
  },
};

export const getPalette = (mode = 'light') => ({
  mode,
  primary: brandColors.primary,
  secondary: brandColors.secondary,
  success: brandColors.success,
  warning: brandColors.warning,
  error: brandColors.error,
  info: brandColors.info,
  background: {
    default: mode === 'light' ? '#F4F7FB' : '#0B0F19', // Signature crisp soft EdTech light background
    paper: mode === 'light' ? '#FFFFFF' : '#111827',
    elevated: mode === 'light' ? '#FFFFFF' : '#1F2937',
    subtle: mode === 'light' ? '#EEF4FC' : '#1E293B',
  },
  text: {
    primary: mode === 'light' ? '#1E293B' : '#F8FAFC',
    secondary: mode === 'light' ? '#64748B' : '#94A3B8',
    disabled: mode === 'light' ? '#94A3B8' : '#64748B',
  },
  divider: mode === 'light' ? '#E5EBF5' : 'rgba(255, 255, 255, 0.08)',
  action: {
    hover: mode === 'light' ? 'rgba(30, 107, 255, 0.04)' : 'rgba(96, 165, 250, 0.08)',
    selected: mode === 'light' ? 'rgba(30, 107, 255, 0.08)' : 'rgba(96, 165, 250, 0.16)',
  },
});
