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

const PatientClaims = () => {
  const [claims, setClaims] = useState([]);
  const [filteredClaims, setFilteredClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadClaims();
  }, []);

  useEffect(() => {
    const filtered = claims.filter(claim =>
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.diagnosis.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredClaims(filtered);
  }, [searchTerm, claims]);

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
    { key: 'diagnosis', label: 'Diagnosis', sortable: true },
    { 
      key: 'claimAmount', 
      label: 'Amount', 
      sortable: true,
      render: (value) => formatCurrency(value)
    },
    { 
      key: 'submittedDate', 
      label: 'Date', 
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
        <h1 className="text-3xl font-bold text-slate-900">My Claims</h1>
        <p className="text-slate-600 mt-1">View your claim history and status</p>
      </div>

      {/* Search */}
      <Card>
        <Input
          placeholder="Search by claim ID, hospital, or diagnosis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={Search}
        />
      </Card>

      {/* Claims Table */}
      <Card>
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-900">
            All Claims ({filteredClaims.length})
          </h2>
        </div>
        <Table
          columns={columns}
          data={filteredClaims}
          onRowClick={(row) => navigate(`/claim/${row.id}`)}
        />
      </Card>
    </div>
  );
};

export default PatientClaims;
