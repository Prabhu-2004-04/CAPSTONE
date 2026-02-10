import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import allianceLogo from '@/assets/alliance-logo.png';

const quickLinks = [
  { label: 'About Alliance', href: '#' },
  { label: 'Admissions', href: '#' },
  { label: 'Academics', href: '#' },
  { label: 'Research', href: '#' },
  { label: 'Campus Life', href: '#' },
  { label: 'Careers', href: '#' },
];

const reportLinks = [
  { label: 'Financial Overview', href: '#financials' },
  { label: 'Academic Achievements', href: '#achievements' },
  { label: 'Research & Innovation', href: '#research' },
  { label: 'Infrastructure', href: '#infrastructure' },
  { label: 'Login / Sign Up', href: '/auth' },
];

export const Footer = () => {
  return (
    <footer className="bg-navy-dark pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Logo & Info */}
          <div className="lg:col-span-1">
            <img 
              src={allianceLogo} 
              alt="Alliance University" 
              className="h-16 w-auto object-contain bg-white/90 rounded p-2 mb-6"
            />
            <p className="text-cream/60 text-sm leading-relaxed mb-6">
              A premier institution committed to academic excellence, research innovation, 
              and holistic development of future leaders.
            </p>
            <div className="flex items-start gap-3 text-sm text-cream/50">
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span>
                Chikkahagade Cross, Chandapura - Anekal Main Road,<br />
                Anekal, Bangalore - 562106
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-cream font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-cream/60 hover:text-gold text-sm transition-colors flex items-center gap-2"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Report Sections */}
          <div>
            <h4 className="text-cream font-semibold mb-5">Report Sections</h4>
            <ul className="space-y-3">
              {reportLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-cream/60 hover:text-gold text-sm transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-cream font-semibold mb-5">Contact Us</h4>
            <div className="space-y-4">
              <a 
                href="tel:+918049577777"
                className="flex items-center gap-3 text-cream/60 hover:text-gold text-sm transition-colors"
              >
                <Phone className="w-5 h-5 text-gold" />
                +91 80 4957 7777
              </a>
              <a 
                href="mailto:info@alliance.edu.in"
                className="flex items-center gap-3 text-cream/60 hover:text-gold text-sm transition-colors"
              >
                <Mail className="w-5 h-5 text-gold" />
                info@alliance.edu.in
              </a>
            </div>

            <div className="mt-8">
              <p className="text-cream/40 text-xs mb-3">Follow Us</p>
              <div className="flex gap-3">
                {['LinkedIn', 'Twitter', 'Facebook', 'Instagram'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-9 h-9 rounded-lg bg-cream/5 hover:bg-gold/20 flex items-center justify-center text-cream/60 hover:text-gold transition-colors text-xs font-medium"
                  >
                    {social.charAt(0)}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-cream/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-cream/40 text-sm">
              © 2025 Alliance University. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-cream/40 text-sm">
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gold transition-colors">Terms of Use</a>
              <a href="#" className="hover:text-gold transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
