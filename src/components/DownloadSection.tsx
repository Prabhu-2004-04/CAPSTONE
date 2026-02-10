import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Download, FileText, FileSpreadsheet, Presentation, ArrowRight } from 'lucide-react';

const downloadOptions = [
  {
    icon: FileText,
    title: 'Full Annual Report',
    format: 'PDF',
    size: '24.5 MB',
    description: 'Complete annual report with all sections and appendices.'
  },
  {
    icon: FileSpreadsheet,
    title: 'Financial Statements',
    format: 'PDF',
    size: '8.2 MB',
    description: 'Detailed financial reports and audit statements.'
  },
  {
    icon: Presentation,
    title: 'Executive Summary',
    format: 'PDF',
    size: '4.1 MB',
    description: 'Key highlights and achievements at a glance.'
  },
];

export const DownloadSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section id="download" className="py-24 bg-navy relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 right-0 w-1/3 h-1/3 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(38 85% 50%) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, hsl(38 85% 50%) 0%, transparent 70%)'
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold font-medium tracking-widest uppercase text-sm mb-4"
          >
            Download Resources
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl font-serif font-semibold text-cream mb-4"
          >
            Get the Complete Report
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-cream/60 text-lg"
          >
            Download the annual report in various formats for offline access 
            and detailed review.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {downloadOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-gold/30 transition-all duration-300 cursor-pointer"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gold/10 text-gold mb-5 group-hover:bg-gold group-hover:text-navy transition-colors">
                <option.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-lg font-semibold text-cream mb-2">
                {option.title}
              </h3>
              
              <p className="text-cream/50 text-sm mb-4">
                {option.description}
              </p>
              
              <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg bg-gold/10 hover:bg-gold hover:text-navy-dark text-gold font-semibold text-sm transition-all duration-300 group-hover:shadow-gold">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-cream/10 group-hover:bg-navy-dark/10 text-xs font-medium rounded">
                    {option.format}
                  </span>
                  <span className="text-cream/40 group-hover:text-navy-dark/60 text-xs">{option.size}</span>
                </div>
                <Download className="w-5 h-5 group-hover:animate-bounce" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Archive Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 text-center"
        >
          <a 
            href="#" 
            className="inline-flex items-center gap-2 text-cream/60 hover:text-gold transition-colors text-sm"
          >
            View Previous Annual Reports
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
