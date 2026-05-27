import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedSection from '@/components/home/FeaturedSection';
import { fetchGuitars } from '@/services/api';

export default async function Home() {
  const guitars = await fetchGuitars();

  return (
    <main className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
      <Navbar />
      <HeroSection />
      <CategoriesSection />
      <FeaturedSection guitars={guitars} />
      <Footer />
    </main>
  );
}