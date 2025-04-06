'use client';

import { setCredentials } from '@/redux/features/authSlice';
import axios from 'axios';
import { Lilita_One } from 'next/font/google';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

const lilitaOne = Lilita_One({ 
  weight: '400', 
  subsets: ['latin'],
  display: 'swap',
});

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:7000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      console.log(response.data)
      
      if (response.data) {
        // Store in Redux and localStorage
        dispatch(setCredentials({
          user: response.data.user,
        }));

        // Redirect to dashboard
        router.push('/participant/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-zinc-600/90 backdrop-blur-sm rounded-lg shadow-2xl max-w-md w-full p-8 relative">
        <button 
          onClick={handleCancel}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="space-y-4">
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none rounded-full w-full pl-12 pr-3 py-4 border-0 bg-zinc-700 placeholder-zinc-400 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-lg"
                  placeholder="Email ID"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="relative">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none rounded-full w-full pl-12 pr-3 py-4 border-0 bg-zinc-700 placeholder-zinc-400 text-white focus:outline-none focus:ring-2 focus:ring-zinc-500 text-lg"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className={`${lilitaOne.className} w-1/2 flex justify-center py-4 px-4 border-0 text-lg font-medium rounded-full text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500`}
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`${lilitaOne.className} w-1/2 flex justify-center py-4 px-4 border-0 text-lg font-medium rounded-full text-white ${
                loading ? 'bg-red-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
            >
              {loading ? (
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'SIGN IN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 