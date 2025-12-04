import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = (userEmail, userPassword) => {
    setEmail(userEmail);
    setPassword(userPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">HC</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Health Claim Platform</h1>
          <p className="text-slate-600">Sign in to manage your claims</p>
        </div>

        {/* Login Form */}
        <Card variant="glass" className="shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              icon={Mail}
              required
            />
            
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={Lock}
              required
            />

            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
              icon={LogIn}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Card>

        {/* Quick Login Options */}
        <div className="mt-6">
          <p className="text-center text-sm text-slate-600 mb-3">Quick login as:</p>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => quickLogin('hospital@example.com', 'hospital123')}
              className="p-3 bg-white rounded-lg border-2 border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-sm font-medium text-slate-700"
            >
              Hospital
            </button>
            <button
              onClick={() => quickLogin('insurance@example.com', 'insurance123')}
              className="p-3 bg-white rounded-lg border-2 border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-sm font-medium text-slate-700"
            >
              Insurance
            </button>
            <button
              onClick={() => quickLogin('patient@example.com', 'patient123')}
              className="p-3 bg-white rounded-lg border-2 border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-all text-sm font-medium text-slate-700"
            >
              Patient
            </button>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 p-4 bg-white/50 backdrop-blur rounded-lg border border-white/20">
          <p className="text-xs text-slate-600 text-center mb-2 font-medium">Demo Credentials:</p>
          <div className="text-xs text-slate-500 space-y-1">
            <p>🏥 Hospital: hospital@example.com / hospital123</p>
            <p>🏢 Insurance: insurance@example.com / insurance123</p>
            <p>👤 Patient: patient@example.com / patient123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
