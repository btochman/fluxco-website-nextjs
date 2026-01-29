import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import SupplyChainSection from '@/components/SupplyChainSection';
import AboutSection from '@/components/AboutSection';
import ProductsSection from '@/components/ProductsSection';
import InventoryPreview from '@/components/InventoryPreview';
import TechnologySection from '@/components/TechnologySection';
import SpecSheetBuilder from '@/components/SpecSheetBuilder';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <SupplyChainSection />
      <AboutSection />
      <ProductsSection />
      <InventoryPreview />
      <TechnologySection />
      <SpecSheetBuilder />
      <ContactSection />
      <Footer />
    </main>
  );
}
