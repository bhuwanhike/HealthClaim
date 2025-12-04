import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Upload as UploadIcon } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { mockApi } from '../../services/mockApi';
import { DOCUMENT_TYPES } from '../../utils/constants';

const SubmitClaim = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    patientName: '',
    patientId: '',
    diagnosis: '',
    treatmentDate: '',
    claimAmount: '',
    hospitalName: 'City General Hospital',
    documents: [],
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files.map(f => f.name)]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await mockApi.submitClaim({
        ...formData,
        claimAmount: parseFloat(formData.claimAmount),
        insuranceCompany: 'HealthGuard Insurance',
      });
      
      alert('Claim submitted successfully!');
      navigate('/my-claims');
    } catch (error) {
      console.error('Error submitting claim:', error);
      alert('Error submitting claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Submit New Claim</h1>
          <p className="text-slate-600 mt-1">Fill in the details to submit a claim</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient Information */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Patient Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Patient Name"
              value={formData.patientName}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              placeholder="Enter patient name"
              required
            />
            <Input
              label="Patient ID"
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              placeholder="Enter patient ID"
              required
            />
          </div>
        </Card>

        {/* Treatment Details */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Treatment Details</h2>
          <div className="space-y-6">
            <Input
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              placeholder="Enter diagnosis"
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Treatment Date"
                type="date"
                value={formData.treatmentDate}
                onChange={(e) => handleInputChange('treatmentDate', e.target.value)}
                required
              />
              <Input
                label="Claim Amount (₹)"
                type="number"
                value={formData.claimAmount}
                onChange={(e) => handleInputChange('claimAmount', e.target.value)}
                placeholder="Enter amount"
                required
              />
            </div>
            <Input
              label="Hospital Name"
              value={formData.hospitalName}
              onChange={(e) => handleInputChange('hospitalName', e.target.value)}
              placeholder="Enter hospital name"
              required
            />
          </div>
        </Card>

        {/* Documents */}
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Supporting Documents</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <UploadIcon size={48} className="text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-700">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  PDF, JPG, PNG up to 10MB
                </p>
              </label>
            </div>

            {formData.documents.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700">
                  Uploaded Documents ({formData.documents.length})
                </p>
                <div className="space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                    >
                      <span className="text-sm text-slate-700">{doc}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== index)
                          }));
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Claim'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitClaim;
