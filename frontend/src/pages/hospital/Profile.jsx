import React, { useState } from 'react';
import { Save } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 9876543210',
    hospitalName: 'City General Hospital',
    registrationNumber: 'HOSP12345',
    address: '123 Medical Street, City',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      alert('Profile updated successfully!');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-600 mt-1">Manage your account information</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Personal Information</h2>
          <div className="space-y-6">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              <Input
                label="Phone Number"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
              />
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Hospital Information</h2>
          <div className="space-y-6">
            <Input
              label="Hospital Name"
              value={formData.hospitalName}
              onChange={(e) => handleInputChange('hospitalName', e.target.value)}
              required
            />
            <Input
              label="Registration Number"
              value={formData.registrationNumber}
              onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
              required
            />
            <Input
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            icon={Save}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Profile;
