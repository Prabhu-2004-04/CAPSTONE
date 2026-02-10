import { motion } from 'framer-motion';
import { ArrowDown, LogIn, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import campusHero from '@/assets/campus-hero.jpg';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={campusHero}
          alt="Alliance University Campus"
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, hsl(220 60% 15% / 0.85), hsl(220 65% 8% / 0.92))'
          }}
        />
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(38 85% 50%) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, hsl(38 85% 50%) 0%, transparent 70%)'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <p className="text-gold font-medium tracking-[0.3em] uppercase text-sm md:text-base mb-6">
            Annual Report 2024-25
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-cream mb-6 text-balance"
        >
          Shaping Tomorrow's
          <span className="block mt-2 gold-text">Leaders Today</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-cream/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light"
        >
          A comprehensive overview of our achievements, innovations, and commitment 
          to academic excellence throughout the academic year.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/auth" 
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-300 overflow-hidden"
            style={{ background: 'var(--gradient-gold)', color: 'hsl(var(--navy-dark))' }}
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-colors duration-300" />
            <LogIn className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">Login / Sign Up</span>
            <Sparkles className="w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.a
            href="#overview"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2 text-cream/50 hover:text-gold transition-colors cursor-pointer"
          >
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <ArrowDown className="w-5 h-5" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};
