import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Quote, Calendar, MapPin } from 'lucide-react';
import campusEvening from '@/assets/campus-evening.jpg';

const highlights = [
  {
    date: 'August 2024',
    title: 'NAAC A++ Accreditation',
    description: 'Alliance University receives the prestigious A++ grade from the National Assessment and Accreditation Council, recognizing our commitment to quality education.'
  },
  {
    date: 'October 2024',
    title: 'International Research Symposium',
    description: 'Hosted 500+ researchers from 30 countries for our annual research symposium on sustainable technology and innovation.'
  },
  {
    date: 'December 2024',
    title: '₹50 Crore Industry Partnership',
    description: 'Signed strategic MoUs with leading tech companies for industry-integrated curriculum and placement opportunities.'
  },
  {
    date: 'January 2025',
    title: 'New Innovation Hub Inauguration',
    description: 'Launched state-of-the-art innovation center with incubation facilities for student and faculty startups.'
  },
];

export const HighlightsSection = () => {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section id="research" className="py-24 bg-background relative">
      <div className="container mx-auto px-4 lg:px-8" ref={containerRef}>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Message */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <p className="text-gold font-medium tracking-widest uppercase text-sm mb-4">
              Vice Chancellor's Message
            </p>
            <h2 className="section-heading mb-6">
              A Year of Transformation
            </h2>
            
            <div className="relative pl-6 border-l-2 border-gold/30">
              <Quote className="absolute -left-4 -top-2 w-8 h-8 text-gold/20" />
              <p className="text-lg text-muted-foreground leading-relaxed mb-6 italic">
                "This year marked a pivotal chapter in our institution's history. We've not only 
                achieved unprecedented academic excellence but have also laid the foundation for 
                becoming a globally recognized center for innovation and research."
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed italic">
                "Our commitment to nurturing future leaders remains unwavering as we continue 
                to evolve and adapt to the changing landscape of higher education."
              </p>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-navy/10 flex items-center justify-center">
                <span className="text-navy font-serif font-bold text-xl">VC</span>
              </div>
              <div>
                <p className="font-semibold text-foreground">Dr. Anubha Singh</p>
                <p className="text-sm text-muted-foreground">Vice Chancellor, Alliance University</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/50 to-transparent" />
            
            <div className="space-y-8">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="relative pl-14"
                >
                  <div className="absolute left-4 top-1 w-4 h-4 rounded-full bg-gold shadow-gold" />
                  
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {item.date}
                  </div>
                  
                  <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Campus Image Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-24 rounded-2xl overflow-hidden shadow-elevated"
        >
          <div className="relative h-[300px] md:h-[400px]">
            <img 
              src={campusEvening} 
              alt="Alliance University Campus" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/80 to-transparent flex items-center">
              <div className="p-8 md:p-12 max-w-lg">
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-cream mb-4">
                  World-Class Infrastructure
                </h3>
                <p className="text-cream/80 mb-6">
                  Our 100-acre campus features state-of-the-art facilities designed 
                  to foster learning, research, and innovation.
                </p>
                <div className="flex items-center gap-2 text-gold">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Anekal, Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
