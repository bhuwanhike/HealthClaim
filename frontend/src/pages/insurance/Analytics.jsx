import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';
import Card from '../../components/ui/Card';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mockApi } from '../../services/mockApi';
import { formatCurrency } from '../../utils/helpers';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await mockApi.getAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
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

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Analytics & Reports</h1>
        <p className="text-slate-600 mt-1">Insights into claim processing and trends</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Claims</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">{analytics?.totalClaims || 0}</p>
            </div>
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <Activity size={24} />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Approval Rate</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {analytics ? Math.round((analytics.approvedClaims / analytics.totalClaims) * 100) : 0}%
              </p>
            </div>
            <div className="bg-success-100 text-success-600 p-3 rounded-xl">
              <TrendingUp size={24} />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Claimed</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {formatCurrency(analytics?.totalClaimAmount || 0)}
              </p>
            </div>
            <div className="bg-purple-100 text-purple-600 p-3 rounded-xl">
              <DollarSign size={24} />
            </div>
          </div>
        </Card>

        <Card hover>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Approved</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">
                {formatCurrency(analytics?.totalApprovedAmount || 0)}
              </p>
            </div>
            <div className="bg-yellow-100 text-yellow-600 p-3 rounded-xl">
              <TrendingDown size={24} />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Monthly Trends</h2>
          <div className="space-y-4">
            {analytics?.monthlyData?.map((month) => (
              <div key={month.month}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-700">{month.month}</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {month.claims} claims • {formatCurrency(month.amount)}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full"
                    style={{ width: `${(month.claims / analytics.totalClaims) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Claim Status Distribution</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <span className="font-medium text-slate-700">Pending</span>
              <span className="text-2xl font-bold text-blue-600">{analytics?.pendingClaims || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-success-50 rounded-lg">
              <span className="font-medium text-slate-700">Approved</span>
              <span className="text-2xl font-bold text-success-600">{analytics?.approvedClaims || 0}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-danger-50 rounded-lg">
              <span className="font-medium text-slate-700">Rejected</span>
              <span className="text-2xl font-bold text-danger-600">{analytics?.rejectedClaims || 0}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Summary Card */}
      <Card variant="gradient">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-2">Average Claim Amount</p>
            <p className="text-3xl font-bold text-slate-900">
              {formatCurrency(analytics?.totalClaimAmount / analytics?.totalClaims || 0)}
            </p>
          </div>
          <div className="text-center border-l border-r border-slate-300">
            <p className="text-slate-600 text-sm mb-2">Average Approved Amount</p>
            <p className="text-3xl font-bold text-success-600">
              {formatCurrency(analytics?.totalApprovedAmount / analytics?.approvedClaims || 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-2">Processing Time</p>
            <p className="text-3xl font-bold text-slate-900">2.5 days</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
