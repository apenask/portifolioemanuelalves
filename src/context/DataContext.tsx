import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface Profile {
  id?: string;
  name: string;
  subtitle: string;
  heroDescription: string;
  bio: string;
  heroImageUrl: string;
  aboutImageUrl: string;
  category: string;
  belt: string;
  team: string;
  city: string;
  state: string;
  startDate: string;
  trajectoryText: string;
  impactPhrase: string;
  social: {
    instagram: string;
    whatsapp: string;
    email: string;
  };
}

export interface AthleteStat {
  id: string;
  label: string;
  value: string;
  suffix: string;
  order: number;
  isVisible: boolean;
}

export interface TimelineItem {
  id: string;
  yearLabel: string;
  title: string;
  description: string;
  order: number;
  isVisible: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  location: string;
  date: string;
  category: string;
  weight: string;
  result: string;
  medal: 'gold' | 'silver' | 'bronze' | 'none';
  category2?: string;
  medal2?: 'gold' | 'silver' | 'bronze' | 'none';
  category3?: string;
  medal3?: 'gold' | 'silver' | 'bronze' | 'none';
  description: string;
  imageUrl: string;
  featured: boolean;
  order: number;
  isVisible: boolean;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  order: number;
  isVisible: boolean;
}

export interface GalleryImage {
  id: string;
  title: string;
  caption: string;
  url: string;
  categoryId: string;
  order: number;
  isVisible: boolean;
}

export interface Sponsor {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  link: string;
  order: number;
  isVisible: boolean;
}

export interface SupportSection {
  id?: string;
  title: string;
  subtitle: string;
  description: string;
  whatsappNumber: string;
  whatsappLink: string;
  email: string;
  instagramUrl: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  imageUrl: string;
  isVisible: boolean;
}

interface DataContextType {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  stats: AthleteStat[];
  setStats: React.Dispatch<React.SetStateAction<AthleteStat[]>>;
  timeline: TimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
  achievements: Achievement[];
  setAchievements: React.Dispatch<React.SetStateAction<Achievement[]>>;
  galleryCategories: GalleryCategory[];
  setGalleryCategories: React.Dispatch<React.SetStateAction<GalleryCategory[]>>;
  gallery: GalleryImage[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryImage[]>>;
  sponsors: Sponsor[];
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[]>>;
  support: SupportSection | null;
  setSupport: React.Dispatch<React.SetStateAction<SupportSection | null>>;
  loading: boolean;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [stats, setStats] = useState<AthleteStat[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [galleryCategories, setGalleryCategories] = useState<GalleryCategory[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [support, setSupport] = useState<SupportSection | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    setLoading(true);
    console.log("VITE_SUPABASE_URL config:", import.meta.env.VITE_SUPABASE_URL);
    
    try {
      // Fetch Profile
      const { data: profileData, error: profileError } = await supabase.from('athlete_profile').select('*').limit(1).maybeSingle();
      console.log("Profile Data:", profileData, "Error:", profileError);
      if (profileData) {
        setProfile({
          id: profileData.id,
          name: profileData.full_name || '',
          subtitle: profileData.short_title || '',
          heroDescription: profileData.hero_description || '',
          bio: profileData.full_bio || '',
          heroImageUrl: profileData.main_image_url || '',
          aboutImageUrl: profileData.secondary_image_url || '',
          category: profileData.category || '',
          belt: profileData.belt || '',
          team: profileData.team_name || '',
          city: profileData.city || '',
          state: profileData.state || '',
          startDate: profileData.start_date || '',
          trajectoryText: profileData.trajectory_text || '',
          impactPhrase: profileData.impact_phrase || '',
          social: {
            instagram: profileData.instagram_url || '',
            whatsapp: profileData.whatsapp_number || '',
            email: profileData.contact_email || '',
          }
        });
      } else {
        setProfile({
          name: '', subtitle: '', heroDescription: '', bio: '', heroImageUrl: '', aboutImageUrl: '',
          category: '', belt: '', team: '', city: '', state: '', startDate: '', trajectoryText: '', impactPhrase: '',
          social: { instagram: '', whatsapp: '', email: '' }
        });
      }

      // Fetch Stats
      const { data: statsData, error: statsError } = await supabase.from('athlete_stats').select('*').order('display_order', { ascending: true });
      if (statsError) console.error("Stats Error:", statsError);
      if (statsData) {
        setStats(statsData.map(s => ({
          id: s.id, label: s.label, value: s.value, suffix: s.suffix || '', order: s.display_order, isVisible: s.is_visible
        })));
      }

      // Fetch Timeline
      const { data: timelineData } = await supabase.from('timeline_items').select('*').order('display_order', { ascending: true });
      if (timelineData) {
        setTimeline(timelineData.map(t => ({
          id: t.id, yearLabel: t.year_label, title: t.title, description: t.description || '', order: t.display_order, isVisible: t.is_visible
        })));
      }

      // Fetch Achievements
      const { data: achievementsData } = await supabase.from('achievements').select('*').order('display_order', { ascending: true });
      if (achievementsData) {
        setAchievements(achievementsData.map(a => ({
          id: a.id, title: a.title, location: a.location || '', date: a.event_date || '', category: a.category || '',
          weight: a.weight_class || '', result: a.result || '', medal: a.medal || 'none', 
          category2: a.category2 || '', medal2: a.medal2 || 'none',
          category3: a.category3 || '', medal3: a.medal3 || 'none',
          description: a.description || '',
          imageUrl: a.image_url || '', featured: a.is_featured, order: a.display_order, isVisible: a.is_visible
        })));
      }

      // Fetch Gallery Categories
      const { data: catData } = await supabase.from('gallery_categories').select('*').order('display_order', { ascending: true });
      if (catData) {
        setGalleryCategories(catData.map(c => ({
          id: c.id, name: c.name, slug: c.slug, order: c.display_order, isVisible: c.is_visible
        })));
      }

      // Fetch Gallery Images
      const { data: galleryData } = await supabase.from('gallery').select('*').order('display_order', { ascending: true });
      if (galleryData) {
        setGallery(galleryData.map(g => ({
          id: g.id, title: g.title || '', caption: g.caption || '', url: g.image_url, categoryId: g.category_id || '',
          order: g.display_order, isVisible: g.is_visible
        })));
      }

      // Fetch Sponsors
      const { data: sponsorsData } = await supabase.from('sponsors').select('*').order('display_order', { ascending: true });
      if (sponsorsData) {
        setSponsors(sponsorsData.map(s => ({
          id: s.id, name: s.name, description: s.description || '', logoUrl: s.logo_url || '', link: s.external_link || '',
          order: s.display_order, isVisible: s.is_visible
        })));
      }

      // Fetch Support Section
      const { data: supportData } = await supabase.from('support_section').select('*').limit(1).maybeSingle();
      if (supportData) {
        setSupport({
          id: supportData.id, title: supportData.title || '', subtitle: supportData.subtitle || '', description: supportData.description || '',
          whatsappNumber: supportData.whatsapp_number || '', whatsappLink: supportData.whatsapp_link || '', email: supportData.email || '',
          instagramUrl: supportData.instagram_url || '', primaryButtonText: supportData.primary_button_text || '',
          primaryButtonLink: supportData.primary_button_link || '', secondaryButtonText: supportData.secondary_button_text || '',
          secondaryButtonLink: supportData.secondary_button_link || '', imageUrl: supportData.image_url || '', isVisible: supportData.is_visible
        });
      } else {
        setSupport({
          title: '', subtitle: '', description: '', whatsappNumber: '', whatsappLink: '', email: '', instagramUrl: '',
          primaryButtonText: '', primaryButtonLink: '', secondaryButtonText: '', secondaryButtonLink: '', imageUrl: '', isVisible: true
        });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{
      profile, setProfile,
      stats, setStats,
      timeline, setTimeline,
      achievements, setAchievements,
      galleryCategories, setGalleryCategories,
      gallery, setGallery,
      sponsors, setSponsors,
      support, setSupport,
      loading, refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
