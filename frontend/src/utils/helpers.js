import { CLAIM_STATUS } from './constants';

// Format date to readable string
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Format date with time
export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Get status color for badges
export const getStatusColor = (status) => {
  const colors = {
    [CLAIM_STATUS.DRAFT]: 'gray',
    [CLAIM_STATUS.SUBMITTED]: 'blue',
    [CLAIM_STATUS.UNDER_REVIEW]: 'yellow',
    [CLAIM_STATUS.APPROVED]: 'green',
    [CLAIM_STATUS.REJECTED]: 'red',
    [CLAIM_STATUS.PAID]: 'purple',
  };
  return colors[status] || 'gray';
};

// Get status label
export const getStatusLabel = (status) => {
  const labels = {
    [CLAIM_STATUS.DRAFT]: 'Draft',
    [CLAIM_STATUS.SUBMITTED]: 'Submitted',
    [CLAIM_STATUS.UNDER_REVIEW]: 'Under Review',
    [CLAIM_STATUS.APPROVED]: 'Approved',
    [CLAIM_STATUS.REJECTED]: 'Rejected',
    [CLAIM_STATUS.PAID]: 'Paid',
  };
  return labels[status] || status;
};

// Generate random ID
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (text.length <= length) return text;
  return text.substr(0, length) + '...';
};

// Get initials from name
export const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substr(0, 2);
};
