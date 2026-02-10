import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  TrendingUp, 
  Award, 
  FlaskConical, 
  Building, 
  Users2, 
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import campusAerial from '@/assets/campus-aerial.jpg';

const sections = [
  {
    icon: TrendingUp,
    title: 'Financial Overview',
    description: 'Comprehensive breakdown of revenue, expenditure, and strategic investments driving institutional growth.',
    highlights: ['₹245 Cr Total Revenue', '32% YoY Growth', 'A+ Credit Rating'],
    color: 'from-emerald-500 to-teal-600'
  },
  {
    icon: Award,
    title: 'Academic Achievements',
    description: 'Celebrating student excellence, faculty accomplishments, and academic milestones across all departments.',
    highlights: ['98.5% Placement Rate', '42 Gold Medals', 'NAAC A++ Grade'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    icon: FlaskConical,
    title: 'Research & Innovation',
    description: 'Pioneering research initiatives, patent filings, and collaborative projects with industry leaders.',
    highlights: ['156 Publications', '28 Patents Filed', '₹12 Cr Research Grants'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    icon: Building,
    title: 'Infrastructure Development',
    description: 'New facilities, technology upgrades, and campus expansion projects completed this year.',
    highlights: ['New Tech Hub', 'Smart Classrooms', 'Green Campus Initiative'],
    color: 'from-rose-500 to-pink-600'
  },
  {
    icon: Users2,
    title: 'Community Engagement',
    description: 'Outreach programs, social initiatives, and partnerships benefiting the local and global community.',
    highlights: ['50+ CSR Projects', '10,000 Beneficiaries', '₹8 Cr Social Impact'],
    color: 'from-violet-500 to-purple-600'
  },
  {
    icon: GraduationCap,
    title: 'Alumni Relations',
    description: 'Growing alumni network, mentorship programs, and notable achievements of our graduates.',
    highlights: ['45,000+ Alumni', 'Global Network', 'Annual Alumni Meet'],
    color: 'from-cyan-500 to-sky-600'
  },
];

export const ReportSections = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section id="achievements" className="py-24 bg-secondary/50 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-5">
        <img src={campusAerial} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative" ref={containerRef}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-gold font-medium tracking-widest uppercase text-sm mb-4"
          >
            Explore the Report
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="section-heading"
          >
            Report Sections
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg"
          >
            Dive deep into each aspect of our university's performance and achievements 
            throughout the academic year 2024-25.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="card-elevated group cursor-pointer"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${section.color} text-white mb-5`}>
                <section.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3 group-hover:text-navy transition-colors">
                {section.title}
              </h3>
              
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                {section.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {section.highlights.map((highlight) => (
                  <span 
                    key={highlight}
                    className="px-3 py-1 bg-navy/5 text-navy text-xs font-medium rounded-full"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 bg-navy/5 text-navy hover:bg-navy hover:text-cream hover:shadow-elevated hover:-translate-y-0.5 group-hover:bg-navy group-hover:text-cream">
                Read More
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
