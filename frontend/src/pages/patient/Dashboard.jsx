import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mockApi } from '../../services/mockApi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { CLAIM_STATUS } from '../../utils/constants';

const PatientDashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadClaims();
  }, []);

  const loadClaims = async () => {
    try {
      const data = await mockApi.getClaims(user.role, user.id);
      setClaims(data);
    } catch (error) {
      console.error('Error loading claims:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const stats = {
    total: claims.length,
    pending: claims.filter(c => c.status === CLAIM_STATUS.SUBMITTED || c.status === CLAIM_STATUS.UNDER_REVIEW).length,
    approved: claims.filter(c => c.status === CLAIM_STATUS.APPROVED || c.status === CLAIM_STATUS.PAID).length,
    totalAmount: claims.reduce((sum, c) => sum + (c.approvedAmount || c.claimAmount), 0),
  };

  const statCards = [
    { label: 'Total Claims', value: stats.total, icon: FileText, color: 'blue', bg: 'bg-blue-100', text: 'text-blue-600' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'green', bg: 'bg-success-100', text: 'text-success-600' },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Track your insurance claims</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover className="relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.bg} ${stat.text} p-3 rounded-xl`}>
                <stat.icon size={24} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Claims */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Your Claims</h2>
        </div>

        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim.id}
              onClick={() => navigate(`/claim/${claim.id}`)}
              className="p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{claim.id}</h3>
                    <Badge status={claim.status} />
                  </div>
                  <p className="text-sm text-slate-600 mb-1">Hospital: {claim.hospitalName}</p>
                  <p className="text-sm text-slate-600">Diagnosis: {claim.diagnosis}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(claim.claimAmount)}</p>
                  {claim.approvedAmount && (
                    <p className="text-sm text-success-600">
                      Approved: {formatCurrency(claim.approvedAmount)}
                    </p>
                  )}
                  <p className="text-xs text-slate-500 mt-1">{formatDate(claim.submittedDate)}</p>
                </div>
              </div>
            </div>
          ))}

          {claims.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <FileText size={48} className="mx-auto mb-3 opacity-30" />
              <p>No claims yet</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PatientDashboard;
