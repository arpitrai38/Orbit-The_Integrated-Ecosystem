/**
 * Formats a date string into readable format (e.g. Sep 29, 2026)
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    });
  } catch {
    return dateString;
  }
};

/**
 * Truncates text with an ellipsis
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Extracts initials from a full name (e.g. "John Doe" -> "JD")
 */
export const getInitials = (name) => {
  if (!name) return 'OR';
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
