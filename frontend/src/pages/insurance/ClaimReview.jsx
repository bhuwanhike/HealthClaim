import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, FileText } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { mockApi } from '../../services/mockApi';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { CLAIM_STATUS } from '../../utils/constants';

const ClaimReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvedAmount, setApprovedAmount] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    loadClaimDetails();
  }, [id]);

  const loadClaimDetails = async () => {
    try {
      const data = await mockApi.getClaimById(id);
      setClaim(data);
      setApprovedAmount(data.claimAmount.toString());
    } catch (error) {
      console.error('Error loading claim:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await mockApi.updateClaimStatus(id, CLAIM_STATUS.APPROVED, parseFloat(approvedAmount));
      alert('Claim approved successfully!');
      navigate('/review-claims');
    } catch (error) {
      console.error('Error aproving claim:', error);
      alert('Error approving claim');
    }
  };

  const handleReject = async () => {
    try {
      await mockApi.updateClaimStatus(id, CLAIM_STATUS.REJECTED);
      alert('Claim rejected');
      navigate('/review-claims');
    } catch (error) {
      console.error('Error rejecting claim:', error);
      alert('Error rejecting claim');
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
      </div>
    );
  }

  const canReview = claim.status === CLAIM_STATUS.SUBMITTED || claim.status === CLAIM_STATUS.UNDER_REVIEW;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
            Back
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-slate-900">{claim.id}</h1>
              <Badge status={claim.status} size="lg" />
            </div>
            <p className="text-slate-600 mt-1">Submitted on {formatDate(claim.submittedDate)}</p>
          </div>
        </div>
        
        {canReview && (
          <div className="flex gap-3">
            <Button
              variant="danger"
              icon={XCircle}
              onClick={() => setShowRejectModal(true)}
            >
              Reject
            </Button>
            <Button
              variant="success"
              icon={CheckCircle}
              onClick={() => setShowApproveModal(true)}
            >
              Approve
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Details */}
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Claim Information</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-slate-600">Hospital</p>
                <p className="font-semibold text-slate-900 mt-1">{claim.hospitalName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Patient</p>
                <p className="font-semibold text-slate-900 mt-1">{claim.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Patient ID</p>
                <p className="font-semibold text-slate-900 mt-1">{claim.patientId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Treatment Date</p>
                <p className="font-semibold text-slate-900 mt-1">{formatDate(claim.treatmentDate)}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-600 mb-2">Diagnosis</p>
              <p className="font-semibold text-slate-900">{claim.diagnosis}</p>
            </div>
          </Card>

          {/* Documents */}
          <Card>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Submitted Documents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {claim.documents?.map((doc, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500 cursor-pointer transition-colors"
                >
                  <FileText size={24} className="text-primary-600" />
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{doc}</p>
                    <p className="text-xs text-slate-500">Click to view</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Amount */}
          <Card variant="gradient">
            <h3 className="text-sm font-medium text-slate-600 mb-4">Claim Amount</h3>
            <p className="text-3xl font-bold text-slate-900">{formatCurrency(claim.claimAmount)}</p>
            {claim.approvedAmount && (
              <div className="mt-4 pt-4 border-t border-slate-200">
                <p className="text-sm text-slate-600">Approved Amount</p>
                <p className="text-2xl font-semibold text-success-600 mt-1">
                  {formatCurrency(claim.approvedAmount)}
                </p>
              </div>
            )}
          </Card>

          {/* Review Checklist */}
          {canReview && (
            <Card>
              <h3 className="text-sm font-medium text-slate-600 mb-4">Review Checklist</h3>
              <div className="space-y-3">
                {[
                  'All documents submitted',
                  'Patient identity verified',
                  'Treatment details clear',
                  'Amount within limits',
                ].map((item, index) => (
                  <label key={index} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-slate-700">{item}</span>
                  </label>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="Approve Claim"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            You are about to approve claim <strong>{claim.id}</strong>. Please confirm the approved amount.
          </p>
          <Input
            label="Approved Amount (₹)"
            type="number"
            value={approvedAmount}
            onChange={(e) => setApprovedAmount(e.target.value)}
            placeholder="Enter approved amount"
            required
          />
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
              Cancel
            </Button>
            <Button variant="success" icon={CheckCircle} onClick={handleApprove}>
              Approve Claim
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="Reject Claim"
      >
        <div className="space-y-6">
          <p className="text-slate-600">
            You are about to reject claim <strong>{claim.id}</strong>. Please provide a reason.
          </p>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rejection Reason <span className="text-danger-500">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="input-field min-h-[100px]"
              placeholder="Enter reason for rejection..."
              required
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" icon={XCircle} onClick={handleReject}>
              Reject Claim
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ClaimReview;
