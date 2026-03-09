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
    
    const { data: signUpData, error } = await supabase.auth.signUp({
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

    // if signup succeeded we can also insert into user_roles directly (trigger may fire
    // only after confirmation depending on config) so we won't end up with student default.
    if (!error && signUpData.user && selectedRole) {
      try {
        await supabase.from('user_roles').insert({
          user_id: signUpData.user.id,
          role: selectedRole,
        });
      } catch (e) {
        // ignore, trigger may handle it
        console.error('insert role fallback', e);
      }
    }
    
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    }
    // OAuth will redirect, so no need to set loading false
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
                  {/* Google Sign In Button */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-border bg-card hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
                    </div>
                  </div>
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
