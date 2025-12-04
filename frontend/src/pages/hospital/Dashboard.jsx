import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp,
  Plus
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mockApi } from '../../services/mockApi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import { CLAIM_STATUS } from '../../utils/constants';

const HospitalDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentClaims, setRecentClaims] = useState([]);
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
      
      setRecentClaims(claims.slice(0, 5));
      setStats({
        totalClaims: claims.length,
        pending: claims.filter(c => c.status === CLAIM_STATUS.SUBMITTED || c.status === CLAIM_STATUS.UNDER_REVIEW).length,
        approved: claims.filter(c => c.status === CLAIM_STATUS.APPROVED || c.status === CLAIM_STATUS.PAID).length,
        rejected: claims.filter(c => c.status === CLAIM_STATUS.REJECTED).length,
        totalAmount: claims.reduce((sum, c) => sum + c.claimAmount, 0),
      });
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
    { label: 'Pending Review', value: stats?.pending || 0, icon: Clock, color: 'yellow', bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { label: 'Approved', value: stats?.approved || 0, icon: CheckCircle, color: 'green', bg: 'bg-success-100', text: 'text-success-600' },
    { label: 'Total Amount', value: formatCurrency(stats?.totalAmount || 0), icon: TrendingUp, color: 'purple', bg: 'bg-secondary-100', text: 'text-secondary-600' },
  ];

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">Overview of your claims and activities</p>
        </div>
        <Button 
          variant="primary"
          icon={Plus}
          onClick={() => navigate('/submit-claim')}
        >
          Submit New Claim
        </Button>
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

      {/* Recent Claims */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-900">Recent Claims</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate('/my-claims')}>
            View All
          </Button>
        </div>

        <div className="space-y-4">
          {recentClaims.map((claim) => (
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
                  <p className="text-sm text-slate-600 mb-1">Patient: {claim.patientName}</p>
                  <p className="text-sm text-slate-600">Diagnosis: {claim.diagnosis}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-900">{formatCurrency(claim.claimAmount)}</p>
                  <p className="text-xs text-slate-500 mt-1">{formatDate(claim.submittedDate)}</p>
                </div>
              </div>
            </div>
          ))}

          {recentClaims.length === 0 && (
            <div className="text-center py-12 text-slate-500">
              <FileText size={48} className="mx-auto mb-3 opacity-30" />
              <p>No claims yet</p>
              <Button 
                variant="primary" 
                size="sm" 
                className="mt-4"
                onClick={() => navigate('/submit-claim')}
              >
                Submit Your First Claim
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default HospitalDashboard;
