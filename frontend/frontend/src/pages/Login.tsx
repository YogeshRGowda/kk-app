import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Initiating Google Sign-In...');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center relative">
        <div className="text-4xl font-bold text-orange-600 mb-8">KK App</div>
        <svg width="150" height="150" viewBox="0 0 200 200">
          <path fill="#FF6B35" stroke="#4C1D95" strokeWidth="4" d="M100,120 C180,70 180,170 100,120 Z"/>
          <path fill="#FFB347" stroke="#4C1D95" strokeWidth="4" d="M100,120 C20,70 20,170 100,120 Z"/>
          <circle cx="100" cy="120" r="40" fill="#10B981" stroke="#4C1D95" strokeWidth="4"/>
          <circle cx="100" cy="120" r="20" fill="#34D399"/>
          <circle cx="140" cy="110" r="10" fill="#FF6B35"/>
          <circle cx="60" cy="110" r="10" fill="#FF6B35"/>
          <path fill="#FFB347" d="M80,80 C90,70 110,70 120,80 L110,100 L90,100 Z"/>
          <path fill="#FFB347" d="M85,85 C92,78 108,78 115,85 L108,95 L92,95 Z"/>
        </svg>
        <div className="absolute bottom-8 left-8 text-sm text-gray-500">V 1.0</div>
      </div>

      {/* Right side - Call to Action and Google Sign-In */}
      <div className="w-1/2 bg-blue-100 flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-regular text-gray-800 mb-8">Start your journey to product stability</h2>
          <button className="bg-white border border-gray-300 rounded-lg py-2 px-4 flex items-center shadow-sm hover:shadow-md transition-shadow">
            <img src="https://www.google.com/favicon.ico" alt="Google logo" className="w-5 h-5 mr-2"/>
            <span>Sign in with Google</span>
          </button>
        </div>
        <div className="absolute bottom-8 right-8 text-xs text-gray-500">Powered By KK</div>
      </div>
    </div>
  );
} 