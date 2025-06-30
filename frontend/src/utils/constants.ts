export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3010/api/v1';

export const EDUCATION_LEVELS = [
  { value: 'high_school', label: 'High School' },
  { value: 'bachelor', label: 'Bachelor\'s Degree' },
  { value: 'master', label: 'Master\'s Degree' },
  { value: 'phd', label: 'PhD' },
  { value: 'certification', label: 'Certification' },
  { value: 'other', label: 'Other' },
];

export const FILE_TYPES = {
  CV: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  CV_EXTENSIONS: ['.pdf', '.docx'],
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADD_CANDIDATE: '/add-candidate',
  CANDIDATES: '/candidates',
};

export const NOTIFICATION_DURATION = 4.5; // seconds 