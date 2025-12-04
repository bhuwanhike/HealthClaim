import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Calendar, DollarSign, Building2, User } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mockApi } from '../../services/mockApi';
import { formatDate, formatCurrency, formatDateTime } from '../../utils/helpers';

const ClaimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClaimDetails();
  }, [id]);

  const loadClaimDetails = async () => {
    try {
      const data = await mockApi.getClaimById(id);
      setClaim(data);
    } catch (error) {
      console.error('Error loading claim:', error);
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

  if (!claim) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Claim not found</p>
        <Button variant="primary" className="mt-4" onClick={() => navigate('/my-claims')}>
          Back to Claims
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Back
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-slate-900">{claim.id}</h1>
            <Badge status={claim.status} size="lg" />
          </div>
          <p className="text-slate-600 mt-1">Submitted on {formatDate(claim.submittedDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Claim Overview</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Patient Name</p>
                  <p className="font-semibold text-slate-900">{claim.patientName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Patient ID</p>
                  <p className="font-semibold text-slate-900">{claim.patientId}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Hospital</p>
                  <p className="font-semibold text-slate-900">{claim.hospitalName}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-2 bg-yellow-100 text-yellow-600 rounded-lg">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Treatment Date</p>
                  <p className="font-semibold text-slate-900">{formatDate(claim.treatmentDate)}</p>
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Diagnosis</p>
              <p className="font-semibold text-slate-900">{claim.diagnosis}</p>
            </div>
          </Card>

          {/* Timeline */}
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Claim Timeline</h2>
            <div className="space-y-6">
              {claim.timeline?.map((event, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      event.status === 'completed' 
                        ? 'bg-success-100 text-success-600' 
                        : 'bg-slate-100 text-slate-400'
                    }`}>
                      {event.status === 'completed' ? '✓' : index + 1}
                    </div>
                    {index < claim.timeline.length - 1 && (
                      <div className={`w-0.5 h-12 ${
                        event.status === 'completed' ? 'bg-success-200' : 'bg-slate-200'
                      }`}></div>
                    )}
                  </div>
                  <div className="flex-1 pb-6">
                    <p className="font-semibold text-slate-900">{event.event}</p>
                    {event.date && (
                      <p className="text-sm text-slate-500 mt-1">{formatDate(event.date)}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount Details */}
          <Card variant="gradient">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Amount Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-700">Claimed Amount</span>
                <span className="font-semibold text-slate-900">{formatCurrency(claim.claimAmount)}</span>
              </div>
              {claim.approvedAmount && (
                <div className="flex justify-between items-center pt-3 border-t border-slate-200">
                  <span className="text-slate-700">Approved Amount</span>
                  <span className="font-semibold text-success-600">{formatCurrency(claim.approvedAmount)}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Documents */}
          <Card>
            <h3 className="text-sm font-medium text-slate-600 mb-4">Documents</h3>
            <div className="space-y-2">
              {claim.documents?.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <FileText size={18} className="text-primary-600" />
                  <span className="text-sm text-slate-700">{doc}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Notes */}
          {claim.notes && claim.notes.length > 0 && (
            <Card>
              <h3 className="text-sm font-medium text-slate-600 mb-4">Activity</h3>
              <div className="space-y-3">
                {claim.notes.map((note, index) => (
                  <div key={index} className="border-l-2 border-primary-500 pl-3">
                    <p className="text-sm text-slate-700">{note.note}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {note.user} • {formatDate(note.date)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClaimDetails;
