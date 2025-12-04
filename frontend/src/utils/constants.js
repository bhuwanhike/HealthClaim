// User Roles
export const USER_ROLES = {
  HOSPITAL: 'hospital',
  INSURANCE: 'insurance',
  PATIENT: 'patient',
};

// Claim Statuses
export const CLAIM_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_REVIEW: 'under_review',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  PAID: 'paid',
};

// Document Types
export const DOCUMENT_TYPES = {
  MEDICAL_BILL: 'medical_bill',
  PRESCRIPTION: 'prescription',
  LAB_REPORT: 'lab_report',
  DISCHARGE_SUMMARY: 'discharge_summary',
  ID_PROOF: 'id_proof',
  INSURANCE_CARD: 'insurance_card',
  OTHER: 'other',
};

// Navigation Items by Role
export const NAVIGATION = {
  [USER_ROLES.HOSPITAL]: [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Submit Claim', path: '/submit-claim', icon: 'FilePlus' },
    { name: 'My Claims', path: '/my-claims', icon: 'FileText' },
    { name: 'Profile', path: '/profile', icon: 'User' },
  ],
  [USER_ROLES.INSURANCE]: [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'Review Claims', path: '/review-claims', icon: 'FileSearch' },
    { name: 'Analytics', path: '/analytics', icon: 'BarChart3' },
    { name: 'Profile', path: '/profile', icon: 'User' },
  ],
  [USER_ROLES.PATIENT]: [
    { name: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
    { name: 'My Claims', path: '/my-claims', icon: 'FileText' },
    { name: 'Upload Documents', path: '/upload-documents', icon: 'Upload' },
    { name: 'Profile', path: '/profile', icon: 'User' },
  ],
};

// Mock Users for Authentication
export const MOCK_USERS = [
  {
    id: 1,
    email: 'hospital@example.com',
    password: 'hospital123',
    role: USER_ROLES.HOSPITAL,
    name: 'City General Hospital',
    avatar: null,
  },
  {
    id: 2,
    email: 'insurance@example.com',
    password: 'insurance123',
    role: USER_ROLES.INSURANCE,
    name: 'HealthGuard Insurance',
    avatar: null,
  },
  {
    id: 3,
    email: 'patient@example.com',
    password: 'patient123',
    role: USER_ROLES.PATIENT,
    name: 'John Doe',
    avatar: null,
  },
];
