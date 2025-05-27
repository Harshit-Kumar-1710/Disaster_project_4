import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAlert } from '../context/AlertContext';
import Logo from '../components/Logo';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useAuth();
  const { addAlert } = useAlert();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (isLogin) {
        await login(email, password);
        addAlert({
          type: 'success',
          message: 'Successfully logged in!'
        });
      } else {
        await signup(email, password, name);
        addAlert({
          type: 'success',
          message: 'Account created successfully!'
        });
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      addAlert({
        type: 'error',
        message: `Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col sm:flex-row">
        <div className="hidden sm:flex sm:w-1/2 bg-blue-700 text-white p-12 flex-col justify-between">
          <div>
            <a href="/" className="flex items-center">
              <ArrowLeft size={20} className="mr-2" />
              <span>Back to home</span>
            </a>
          </div>
          
          <div className="space-y-6">
            <h1 className="text-4xl font-bold">SafeEscape</h1>
            <p className="text-xl text-blue-100">Your safety is our priority. Log in to access personalized evacuation routes and safety information.</p>
            
            <div className="space-y-4 mt-8">
              <div className="flex items-start">
                <div className="mt-1 bg-blue-600 rounded-full p-1">
                  <User size={16} />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Personal Profile</h3>
                  <p className="text-blue-200 text-sm">Create your profile to save your frequent locations</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mt-1 bg-blue-600 rounded-full p-1">
                  <Lock size={16} />
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Secure Access</h3>
                  <p className="text-blue-200 text-sm">Your data is encrypted and securely stored</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-sm text-blue-200">
            &copy; {new Date().getFullYear()} SafeEscape. All rights reserved.
          </div>
        </div>
        
        <div className="sm:w-1/2 p-8 sm:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo className="h-12 w-12" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
              </h2>
              <p className="mt-2 text-gray-600">
                {isLogin 
                  ? "Enter your credentials to access your account" 
                  : "Fill in your details to create a SafeEscape account"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="name" className="input-label">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <User size={18} />
                    </div>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field pl-10"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>
              )}
              
              <div className="input-group">
                <label htmlFor="email" className="input-label">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Mail size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor="password" className="input-label">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                    <Lock size={18} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder={isLogin ? "Enter your password" : "Create a strong password"}
                    required
                    minLength={6}
                  />
                </div>
                {isLogin && (
                  <div className="text-right mt-1">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-800">
                      Forgot password?
                    </a>
                  </div>
                )}
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full flex justify-center items-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></span>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>
            
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>
            
            <div className="sm:hidden mt-8 text-center">
              <a href="/" className="text-blue-600 hover:text-blue-800 flex items-center justify-center">
                <ArrowLeft size={18} className="mr-2" />
                <span>Back to home</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;