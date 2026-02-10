import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import allianceLogo from '@/assets/alliance-logo.png';

const navItems = [
  { label: 'Overview', href: '#overview' },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Research', href: '#research' },
  { label: 'Infrastructure', href: '#infrastructure' },
  { label: 'Financials', href: '#financials' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
];



export const Header = () => {
  const { user, role } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-navy/95 backdrop-blur-md shadow-elevated py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img 
              src={allianceLogo} 
              alt="Alliance University" 
              className="h-12 w-auto object-contain bg-white/90 rounded p-1"
            />
            <div className="hidden md:block">
              <p className="text-cream text-xs font-medium uppercase tracking-widest">
                Annual Report
              </p>
              <p className="text-gold text-lg font-serif font-semibold">
                2024-25
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          {/* Year Selector & Auth */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link 
                to="/dashboard" 
                className="flex items-center gap-2 px-4 py-2 rounded-md border border-gold/50 text-gold text-sm font-medium hover:bg-gold/10 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="capitalize">{role || 'Dashboard'}</span>
              </Link>
            ) : (
              <Link to="/auth" className="btn-gold text-sm">
                <LogIn className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 text-cream"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden mt-4 pb-4 border-t border-cream/10"
          >
            <div className="pt-4 space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-4 py-2 text-cream/80 hover:text-cream hover:bg-cream/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4 mt-4 border-t border-cream/10 space-y-3">
                {user ? (
                  <Link 
                    to="/dashboard" 
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-md border border-gold/50 text-gold text-sm font-medium"
                  >
                    <User className="w-4 h-4" />
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link to="/auth" className="btn-gold w-full text-center">
                    <LogIn className="w-4 h-4" />
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};
