import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Clock, CheckCircle, XCircle, TrendingUp } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mockApi } from '../../services/mockApi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { CLAIM_STATUS } from '../../utils/constants';

const InsuranceDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingClaims, setPendingClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [claims, analytics] = await Promise.all([
        mockApi.getClaims(user.role, user.id),
        mockApi.getAnalytics()
      ]);
      
      const pending = claims.filter(c => 
        c.status === CLAIM_STATUS.SUBMITTED || c.status === CLAIM_STATUS.UNDER_REVIEW
      );
      setPendingClaims(pending.slice(0, 5));
      setStats(analytics);
    } catch (error) {
      console.error('Error loading dashboard:', error);
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

  const statCards = [
    { label: 'Total Claims', value: stats?.totalClaims || 0, icon: FileText, color: 'blue', bg: 'bg-blue-100', text: 'text-blue-600' },
    { label: 'Pending Review', value: stats?.pendingClaims || 0, icon: Clock, color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { label: 'Approved', value: stats?.approvedClaims || 0, icon: CheckCircle, color: 'green', bg: 'bg-success-100', text: 'text-success-600' },
    { label: 'Total Approved', value: formatCurrency(stats?.totalApprovedAmount || 0), icon: TrendingUp, color: 'purple', bg: 'bg-secondary-100', text: 'text-secondary-600' },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">Overview of claims and analytics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Pending Claims */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-slate-900">Pending Reviews</h2>
              <button
                onClick={() => navigate('/review-claims')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View All
              </button>
            </div>

            <div className="space-y-4">
              {pendingClaims.map((claim) => (
                <div
                  key={claim.id}
                  onClick={() => navigate(`/review-claim/${claim.id}`)}
                  className="p-4 border border-slate-200 rounded-lg hover:border-primary-500 hover:bg-primary-50/30 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{claim.id}</h3>
                        <Badge status={claim.status} />
                      </div>
                      <p className="text-sm text-slate-600 mb-1">Hospital: {claim.hospitalName}</p>
                      <p className="text-sm text-slate-600">Patient: {claim.patientName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">{formatCurrency(claim.claimAmount)}</p>
                      <p className="text-xs text-slate-500 mt-1">{formatDate(claim.submittedDate)}</p>
                    </div>
                  </div>
                </div>
              ))}

              {pendingClaims.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <CheckCircle size={48} className="mx-auto mb-3 opacity-30" />
                  <p>All caught up! No pending claims to review.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card variant="gradient">
            <h3 className="text-sm font-medium text-slate-600 mb-4">This Month</h3>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold text-slate-900">{stats?.monthlyData?.[1]?.claims || 0}</p>
                <p className="text-sm text-slate-600">Claims Processed</p>
              </div>
              <div className="pt-3 border-t border-slate-200">
                <p className="text-2xl font-bold text-success-600">
                  {formatCurrency(stats?.monthlyData?.[1]?.amount || 0)}
                </p>
                <p className="text-sm text-slate-600">Amount Processed</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-sm font-medium text-slate-600 mb-4">Approval Rate</h3>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-slate-900">
                    {stats ? Math.round((stats.approvedClaims / stats.totalClaims) * 100) : 0}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded-full bg-slate-200">
                <div
                  style={{ width: `${stats ? (stats.approvedClaims / stats.totalClaims) * 100 : 0}%` }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-success-500 to-success-600"
                ></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InsuranceDashboard;
