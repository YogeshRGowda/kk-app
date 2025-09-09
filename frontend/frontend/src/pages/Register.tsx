import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    designation: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(formData.email, formData.password, formData.name, formData.designation);
      navigate('/login', { state: { message: 'Registration successful. Please verify your email.' } });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="w-1/2 bg-orange-50 flex flex-col items-center justify-center relative">
        <div className="text-4xl font-bold text-orange-500 mb-16">KK App</div>
        <div className="relative">
          <svg width="200" height="200" viewBox="0 0 200 200" className="mb-8">
            <ellipse cx="100" cy="120" rx="80" ry="50" fill="#ff6b35" stroke="#4c1d95" strokeWidth="4"/>
            <polygon points="80,80 120,80 110,100 90,100" fill="#ffb347"/>
            <polygon points="85,85 115,85 108,95 92,95" fill="#ff6b35"/>
            <circle cx="140" cy="60" r="20" fill="#10b981" stroke="#1f2937" strokeWidth="3"/>
            <circle cx="135" cy="55" r="8" fill="#34d399"/>
            <ellipse cx="50" cy="160" rx="15" ry="8" fill="#4c1d95"/>
            <ellipse cx="150" cy="160" rx="15" ry="8" fill="#4c1d95"/>
            <path d="M 60 40 Q 100 20 140 40" stroke="#4c1d95" strokeWidth="3" fill="none"/>
          </svg>
          <div className="absolute bottom-12 right-8 w-4 h-4 bg-teal-400 rounded-full"></div>
        </div>
        <div className="absolute bottom-8 left-8 text-sm text-gray-500">V 1.0</div>
      </div>

      {/* Right side - Registration Form */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center">
        <div className="w-full max-w-md px-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">Create an Account</h2>
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="designation" className="block text-sm font-medium text-gray-700 mb-1">
                Designation
              </label>
              <input
                id="designation"
                name="designation"
                type="text"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your designation"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Create a password"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                placeholder="Confirm your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-500 hover:text-orange-600">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 