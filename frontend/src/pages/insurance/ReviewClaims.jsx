import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Table from '../../components/ui/Table';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mockApi } from '../../services/mockApi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { CLAIM_STATUS } from '../../utils/constants';

const ReviewClaims = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadClaims();
  }, []);

  useEffect(() => {
    let filtered = claims;
    
    if (searchTerm) {
      filtered = filtered.filter(claim =>
        claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(claim => claim.status === statusFilter);
    }
    
    setFilteredClaims(filtered);
  }, [searchTerm, statusFilter, claims]);

  const loadClaims = async () => {
    try {
      const data = await mockApi.getClaims(user.role, user.id);
      setClaims(data);
      setFilteredClaims(data);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: 'id', label: 'Claim ID', sortable: true },
    { key: 'hospitalName', label: 'Hospital', sortable: true },
    { key: 'patientName', label: 'Patient', sortable: true },
    { 
      key: 'claimAmount', 
      label: 'Claimed', 
      sortable: true,
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'submittedDate', 
      label: 'Submitted', 
      sortable: true,
      render: (value) => formatDate(value)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => <Badge status={value} />
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Review Claims</h1>
        <p className="text-slate-600 mt-1">Review and process submitted claims</p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by claim ID, hospital, or patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full md:w-48"
          >
            <option value="all">All Status</option>
            <option value={CLAIM_STATUS.SUBMITTED}>Submitted</option>
            <option value={CLAIM_STATUS.UNDER_REVIEW}>Under Review</option>
            <option value={CLAIM_STATUS.APPROVED}>Approved</option>
            <option value={CLAIM_STATUS.REJECTED}>Rejected</option>
          </select>
        </div>
      </Card>

      {/* Claims Table */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            Claims ({filteredClaims.length})
          </h2>
        </div>
        <Table
          columns={columns}
          data={filteredClaims}
          onRowClick={(row) => navigate(`/review-claim/${row.id}`)}
        />
      </Card>
    </div>
  );
};

export default ReviewClaims;
