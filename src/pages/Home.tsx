import React from 'react';
import HeroSection from '../components/home/HeroSection';
import AboutSection from '../components/home/AboutSection';
import TrajectorySection from '../components/home/TrajectorySection';
import AchievementsSection from '../components/home/AchievementsSection';
import GallerySection from '../components/home/GallerySection';
import SponsorsSection from '../components/home/SponsorsSection';
import ContactSection from '../components/home/ContactSection';
import { useData } from '../context/DataContext';

export default function Home() {
  const { loading, profile } = useData();

  if (loading) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500">Carregando...</div>;
  }

  if (!profile) {
    return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-white">Nenhum perfil encontrado. Configure no painel admin.</div>;
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white selection:bg-gold-500 selection:text-dark-900">
      <HeroSection />
      <AboutSection />
      <TrajectorySection />
      <AchievementsSection />
      <GallerySection />
      <SponsorsSection />
      <ContactSection />
    </div>
  );
}
