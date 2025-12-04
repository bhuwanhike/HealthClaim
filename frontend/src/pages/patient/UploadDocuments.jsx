import React, { useState } from 'react';
import { Upload as UploadIcon, X } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { mockApi } from '../../services/mockApi';

const UploadDocuments = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [claimId, setClaimId] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (!claimId) {
      alert('Please enter a claim ID');
      return;
    }
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }

    setUploading(true);
    try {
      for (const file of selectedFiles) {
        await mockApi.uploadDocument(file, claimId);
      }
      alert('Documents uploaded successfully!');
      setSelectedFiles([]);
      setClaimId('');
    } catch (error) {
      console.error('Error uploading documents:', error);
      alert('Error uploading documents');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Upload Documents</h1>
        <p className="text-slate-600 mt-1">Submit additional documents for your claims</p>
      </div>

      {/* Claim ID Input */}
      <Card>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Claim ID <span className="text-danger-500">*</span>
            </label>
            <input
              type="text"
              value={claimId}
              onChange={(e) => setClaimId(e.target.value)}
              placeholder="Enter claim ID (e.g., CLM001)"
              className="input-field"
            />
          </div>
        </div>
      </Card>

      {/* File Upload */}
      <Card>
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Select Documents</h2>
        
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors">
          <input
            type="file"
            id="file-upload"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <UploadIcon size={64} className="text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-700 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-500">
              PDF, JPG, PNG up to 10MB each
            </p>
          </label>
        </div>

        {/* Selected Files */}
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-slate-700 mb-4">
              Selected Files ({selectedFiles.length})
            </h3>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-100 text-primary-600 rounded">
                      <UploadIcon size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-sm text-slate-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-slate-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Actions */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          icon={UploadIcon}
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0 || !claimId}
        >
          {uploading ? 'Uploading...' : 'Upload Documents'}
        </Button>
      </div>

      {/* Info Card */}
      <Card variant="glass">
        <h3 className="text-sm font-semibold text-slate-900 mb-3">📝 Document Guidelines</h3>
        <ul className="text-sm text-slate-600 space-y-2">
          <li>• Upload clear, legible copies of documents</li>
          <li>• Ensure all personal information is visible</li>
          <li>• Accepted formats: PDF, JPG, PNG</li>
          <li>• Maximum file size: 10MB per file</li>
          <li>• You can upload multiple documents at once</li>
        </ul>
      </Card>
    </div>
  );
};

export default UploadDocuments;
