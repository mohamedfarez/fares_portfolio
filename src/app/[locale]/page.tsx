import { Navigation } from '@/components/layout/navigation';
import { HeroSection } from '@/components/sections/hero-section';
import { AITwinSection } from '@/components/sections/ai-twin-section';
import { AboutSection } from '@/components/sections/about-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { ExperienceSection } from '@/components/sections/experience-section';
import { EducationSection } from '@/components/sections/education-section';
import { SkillsSection } from '@/components/sections/skills-section';
import { ContactSection } from '@/components/sections/contact-section';
import { CVSection } from '@/components/sections/cv-section';
import { Footer } from '@/components/layout/footer';
import { NeuralBackground } from '@/components/ui/neural-background';
import DemoShowcase from '@/components/demos/demo-showcase';

// Force dynamic rendering for i18n
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      {/* Neural Network Background */}
      <NeuralBackground />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Page Sections */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />
        
        {/* AI Twin Section */}
        <AITwinSection />
        
        {/* About Section */}
        <AboutSection />
        
        {/* Projects Section */}
        <ProjectsSection />

        {/* Live AI Demos Section */}
        <section id="demos" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <DemoShowcase />
          </div>
        </section>

        {/* Experience Section */}
        <ExperienceSection />

        {/* Education Section */}
        <EducationSection />

        {/* Skills Section */}
        <SkillsSection />
        
        {/* CV Download Section */}
        <CVSection />
        
        {/* Contact Section */}
        <ContactSection />
      </div>
      
      {/* Footer */}
      <Footer />
    </main>
  );
}
