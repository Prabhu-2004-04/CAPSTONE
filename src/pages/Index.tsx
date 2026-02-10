import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { StatsSection } from '@/components/StatsSection';
import { ReportSections } from '@/components/ReportSections';
import { HighlightsSection } from '@/components/HighlightsSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <ReportSections />
        <HighlightsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
