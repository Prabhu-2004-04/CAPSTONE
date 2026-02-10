import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, ArrowLeft, Mail, Lock, User, Loader2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { z } from 'zod';
import allianceLogo from '@/assets/alliance-logo.png';
import campusHero from '@/assets/campus-hero.jpg';

type UserRole = 'student' | 'teacher';
type AuthMode = 'select' | 'login' | 'signup';

const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z.string().min(6, 'Password must be at least 6 characters');

const Auth = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<AuthMode>('select');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setAuthMode('login');
    setError(null);
    setSuccess(null);
  };

  const handleBack = () => {
    if (authMode === 'login' || authMode === 'signup') {
      setAuthMode('select');
      setSelectedRole(null);
      setEmail('');
      setPassword('');
      setFullName('');
      setError(null);
      setSuccess(null);
    }
  };

  const validateInputs = () => {
    try {
      emailSchema.parse(email);
    } catch {
      setError('Please enter a valid email address');
      return false;
    }
    
    try {
      passwordSchema.parse(password);
    } catch {
      setError('Password must be at least 6 characters');
      return false;
    }
    
    if (authMode === 'signup' && !fullName.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Please verify your email before logging in.');
      } else {
        setError(error.message);
      }
    } else {
      navigate('/dashboard');
    }
    
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateInputs()) return;
    
    setLoading(true);
    setError(null);
    
    const redirectUrl = `${window.location.origin}/dashboard`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
          role: selectedRole,
        },
      },
    });
    
    if (error) {
      if (error.message.includes('User already registered')) {
        setError('An account with this email already exists. Please login instead.');
      } else {
        setError(error.message);
      }
    } else {
      setSuccess('Registration successful! Please check your email to verify your account.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        <img
          src={campusHero}
          alt="Alliance University Campus"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 flex flex-col justify-end p-12"
          style={{
            background: 'linear-gradient(to top, hsl(220 60% 15% / 0.95), hsl(220 60% 15% / 0.3))'
          }}
        >
          <h2 className="text-3xl font-serif font-bold text-cream mb-4">
            Annual Report Portal
          </h2>
          <p className="text-cream/70 text-lg">
            Access comprehensive insights into our university's achievements, 
            research, and financial performance.
          </p>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={allianceLogo} 
              alt="Alliance University" 
              className="h-20 w-auto object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-serif font-bold text-foreground">
              Welcome to the Portal
            </h1>
          </div>

          <AnimatePresence mode="wait">
            {/* Role Selection */}
            {authMode === 'select' && (
              <motion.div
                key="select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <p className="text-center text-muted-foreground mb-8">
                  Select your role to continue
                </p>
                
                <button
                  onClick={() => handleRoleSelect('student')}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-gold bg-card hover:bg-gold/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-navy/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                      <GraduationCap className="w-7 h-7 text-navy group-hover:text-gold transition-colors" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-foreground">Student Login</h3>
                      <p className="text-sm text-muted-foreground">Access your academic reports and resources</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleRoleSelect('teacher')}
                  className="w-full p-6 rounded-xl border-2 border-border hover:border-gold bg-card hover:bg-gold/5 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-navy/10 group-hover:bg-gold/20 flex items-center justify-center transition-colors">
                      <BookOpen className="w-7 h-7 text-navy group-hover:text-gold transition-colors" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-foreground">Faculty Login</h3>
                      <p className="text-sm text-muted-foreground">Access department reports and analytics</p>
                    </div>
                  </div>
                </button>

                <div className="text-center pt-4">
                  <a 
                    href="/"
                    className="text-sm text-muted-foreground hover:text-gold transition-colors"
                  >
                    ← Back to Home
                  </a>
                </div>
              </motion.div>
            )}

            {/* Login Form */}
            {(authMode === 'login' || authMode === 'signup') && (
              <motion.div
                key="auth-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>

                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                    {selectedRole === 'student' ? (
                      <GraduationCap className="w-6 h-6 text-gold" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-gold" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {authMode === 'login' ? 'Sign In' : 'Create Account'}
                    </h2>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedRole} Portal
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-sm">
                    {success}
                  </div>
                )}

                <form onSubmit={authMode === 'login' ? handleLogin : handleSignup} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-card focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 rounded-lg border border-border bg-card focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-gold py-3 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : authMode === 'login' ? (
                      'Sign In'
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </form>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  {authMode === 'login' ? (
                    <>
                      Don't have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('signup');
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-gold hover:underline font-medium"
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setAuthMode('login');
                          setError(null);
                          setSuccess(null);
                        }}
                        className="text-gold hover:underline font-medium"
                      >
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Auth;
