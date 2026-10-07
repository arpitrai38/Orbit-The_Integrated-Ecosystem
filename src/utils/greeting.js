/**
 * Helper to compute time-of-day greeting (Good morning, Good afternoon, Good evening)
 */
export const getDynamicGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon';
  } else if (hour >= 17 && hour < 22) {
    return 'Good evening';
  }
  return 'Welcome';
};

/**
 * Retrieve current authenticated user profile from localStorage
 */
export const getLoggedInUser = (fallbackRole = 'User') => {
  try {
    const raw = localStorage.getItem('orbit_user_profile');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.name) return parsed;
    }
  } catch {
    // Ignored
  }
  return {
    name: fallbackRole,
    role: fallbackRole.toUpperCase(),
    department: 'ORBIT University',
  };
};

/**
 * Log out user: clears authentication credentials and session tokens
 */
export const logoutUser = () => {
  try {
    localStorage.removeItem('orbit_auth_token');
    localStorage.removeItem('orbit_user_profile');
    localStorage.removeItem('orbit_active_role');
    sessionStorage.clear();
  } catch {
    // Ignored
  }
};

export default {
  getDynamicGreeting,
  getLoggedInUser,
  logoutUser,
};

