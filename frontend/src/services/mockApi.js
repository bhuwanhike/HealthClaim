import { CLAIM_STATUS, MOCK_USERS, USER_ROLES } from '../utils/constants';
import { generateId } from '../utils/helpers';

// Simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// Mock claims data
const mockClaims = [
  {
    id: 'CLM001',
    patientName: 'John Doe',
    patientId: 'PAT123',
    hospitalName: 'City General Hospital',
    diagnosis: 'Acute Appendicitis',
    treatmentDate: '2024-11-25',
    claimAmount: 125000,
    approvedAmount: 125000,
    status: CLAIM_STATUS.APPROVED,
    submittedDate: '2024-11-26',
    documents: ['Medical Bill', 'Discharge Summary', 'Lab Reports'],
    insuranceCompany: 'HealthGuard Insurance',
  },
  {
    id: 'CLM002',
    patientName: 'Jane Smith',
    patientId: 'PAT124',
    hospitalName: 'City General Hospital',
    diagnosis: 'Diabetes Management',
    treatmentDate: '2024-11-28',
    claimAmount: 45000,
    approvedAmount: null,
    status: CLAIM_STATUS.UNDER_REVIEW,
    submittedDate: '2024-11-29',
    documents: ['Medical Bill', 'Prescription'],
    insuranceCompany: 'HealthGuard Insurance',
  },
  {
    id: 'CLM003',
    patientName: 'Robert Johnson',
    patientId: 'PAT125',
    hospitalName: 'City General Hospital',
    diagnosis: 'Fractured Leg',
    treatmentDate: '2024-12-01',
    claimAmount: 85000,
    approvedAmount: null,
    status: CLAIM_STATUS.SUBMITTED,
    submittedDate: '2024-12-02',
    documents: ['Medical Bill', 'X-Ray Reports'],
    insuranceCompany: 'HealthGuard Insurance',
  },
  {
    id: 'CLM004',
    patientName: 'Emily Davis',
    patientId: 'PAT126',
    hospitalName: 'Mercy Hospital',
    diagnosis: 'Cardiac Check-up',
    treatmentDate: '2024-11-20',
    claimAmount: 35000,
    approvedAmount: 30000,
    status: CLAIM_STATUS.PAID,
    submittedDate: '2024-11-21',
    documents: ['Medical Bill', 'ECG Report'],
    insuranceCompany: 'HealthGuard Insurance',
  },
];

// Mock API Service
export const mockApi = {
  // Authentication
  login: async (email, password) => {
    await delay();
    const user = MOCK_USERS.find(u => u.email === email && u.password === password);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        token: `mock-token-${user.id}`,
      };
    }
    throw new Error('Invalid credentials');
  },

  // Claims
  getClaims: async (role, userId) => {
    await delay();
    if (role === USER_ROLES.HOSPITAL) {
      return mockClaims;
    } else if (role === USER_ROLES.INSURANCE) {
      return mockClaims;
    } else if (role === USER_ROLES.PATIENT) {
      return mockClaims.slice(0, 2); // Patient sees only their claims
    }
    return [];
  },

  getClaimById: async (claimId) => {
    await delay();
    const claim = mockClaims.find(c => c.id === claimId);
    if (claim) {
      return {
        ...claim,
        timeline: [
          { date: claim.submittedDate, event: 'Claim Submitted', status: 'completed' },
          { date: claim.submittedDate, event: 'Documents Uploaded', status: 'completed' },
          { date: claim.status !== CLAIM_STATUS.SUBMITTED ? '2024-11-27' : null, event: 'Under Review', status: claim.status !== CLAIM_STATUS.SUBMITTED ? 'completed' : 'pending' },
          { date: claim.status === CLAIM_STATUS.APPROVED || claim.status === CLAIM_STATUS.PAID ? '2024-11-29' : null, event: 'Approved', status: claim.status === CLAIM_STATUS.APPROVED || claim.status === CLAIM_STATUS.PAID ? 'completed' : 'pending' },
          { date: claim.status === CLAIM_STATUS.PAID ? '2024-12-01' : null, event: 'Payment Processed', status: claim.status === CLAIM_STATUS.PAID ? 'completed' : 'pending' },
        ],
        notes: [
          { date: '2024-11-26', user: 'Hospital Admin', note: 'Claim submitted with all required documents.' },
          { date: '2024-11-27', user: 'Insurance Reviewer', note: 'Started document verification.' },
        ],
      };
    }
    throw new Error('Claim not found');
  },

  submitClaim: async (claimData) => {
    await delay(1000);
    const newClaim = {
      id: `CLM${String(mockClaims.length + 1).padStart(3, '0')}`,
      ...claimData,
      status: CLAIM_STATUS.SUBMITTED,
      submittedDate: new Date().toISOString().split('T')[0],
      approvedAmount: null,
    };
    mockClaims.push(newClaim);
    return newClaim;
  },

  updateClaimStatus: async (claimId, status, approvedAmount = null) => {
    await delay();
    const claim = mockClaims.find(c => c.id === claimId);
    if (claim) {
      claim.status = status;
      if (approvedAmount !== null) {
        claim.approvedAmount = approvedAmount;
      }
      return claim;
    }
    throw new Error('Claim not found');
  },

  // Analytics
  getAnalytics: async () => {
    await delay();
    return {
      totalClaims: mockClaims.length,
      pendingClaims: mockClaims.filter(c => c.status === CLAIM_STATUS.UNDER_REVIEW || c.status === CLAIM_STATUS.SUBMITTED).length,
      approvedClaims: mockClaims.filter(c => c.status === CLAIM_STATUS.APPROVED || c.status === CLAIM_STATUS.PAID).length,
      rejectedClaims: mockClaims.filter(c => c.status === CLAIM_STATUS.REJECTED).length,
      totalClaimAmount: mockClaims.reduce((sum, c) => sum + c.claimAmount, 0),
      totalApprovedAmount: mockClaims.filter(c => c.approvedAmount).reduce((sum, c) => sum + c.approvedAmount, 0),
      monthlyData: [
        { month: 'Nov', claims: 3, amount: 205000 },
        { month: 'Dec', claims: 1, amount: 85000 },
      ],
    };
  },

  // Documents
  uploadDocument: async (file, claimId) => {
    await delay(1500);
    return {
      id: generateId(),
      name: file.name,
      size: file.size,
      uploadDate: new Date().toISOString(),
      claimId,
    };
  },

  // Profile
  updateProfile: async (userId, profileData) => {
    await delay();
    return {
      ...profileData,
      updatedAt: new Date().toISOString(),
    };
  },
};
