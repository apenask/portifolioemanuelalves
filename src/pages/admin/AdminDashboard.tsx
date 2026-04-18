import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ProfileTab from './tabs/ProfileTab';
import TimelineTab from './tabs/TimelineTab';
import StatsTab from './tabs/StatsTab';
import AchievementsTab from './tabs/AchievementsTab';
import GalleryTab from './tabs/GalleryTab';
import SponsorsTab from './tabs/SponsorsTab';
import SupportTab from './tabs/SupportTab';

type TabType = 'profile' | 'timeline' | 'stats' | 'achievements' | 'gallery' | 'sponsors' | 'support';

export default function AdminDashboard() {
  const { profile, support, refreshData } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  if (!profile) return <div className="min-h-screen bg-dark-900 flex items-center justify-center text-gold-500">Carregando perfil...</div>;

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      if (activeTab === 'profile') {
        // Save Profile
        const [city, state] = profile.city ? [profile.city, profile.state] : profile.location ? profile.location.split(',').map(s => s.trim()) : ['', ''];
        
        const updateProfileData = {
          full_name: profile.name,
          short_title: profile.subtitle,
          hero_description: profile.heroDescription,
          full_bio: profile.bio,
          main_image_url: profile.heroImageUrl,
          secondary_image_url: profile.aboutImageUrl,
          category: profile.category,
          belt: profile.belt,
          team_name: profile.team,
          city: city || '',
          state: state || '',
          start_date: profile.startDate || null,
          trajectory_text: profile.trajectoryText,
          impact_phrase: profile.impactPhrase,
          instagram_url: profile.social.instagram,
          whatsapp_number: profile.social.whatsapp,
          contact_email: profile.social.email,
          updated_at: new Date().toISOString()
        };

        if (profile.id) {
          const { error } = await supabase.from('athlete_profile').update(updateProfileData).eq('id', profile.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from('athlete_profile').insert([updateProfileData]);
          if (error) throw error;
        }
      } else if (activeTab === 'support') {
        // Save Support Section
        if (support) {
          const updateSupportData = {
            title: support.title,
            subtitle: support.subtitle,
            description: support.description,
            whatsapp_number: support.whatsappNumber,
            whatsapp_link: support.whatsappLink,
            email: support.email,
            instagram_url: support.instagramUrl,
            primary_button_text: support.primaryButtonText,
            primary_button_link: support.primaryButtonLink,
            secondary_button_text: support.secondaryButtonText,
            secondary_button_link: support.secondaryButtonLink,
            image_url: support.imageUrl,
            is_visible: support.isVisible,
            updated_at: new Date().toISOString()
          };

          if (support.id) {
            const { error } = await supabase.from('support_section').update(updateSupportData).eq('id', support.id);
            if (error) throw error;
          } else {
            const { error } = await supabase.from('support_section').insert([updateSupportData]);
            if (error) throw error;
          }
        }
      }
      
      setSaveMessage('Alterações salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
      await refreshData();
    } catch (error: any) {
      console.error("Erro ao salvar:", error);
      setSaveMessage(`Erro ao salvar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const tabs: { id: TabType, label: string }[] = [
    { id: 'profile', label: 'Perfil' },
    { id: 'timeline', label: 'Trajetória' },
    { id: 'stats', label: 'Estatísticas' },
    { id: 'achievements', label: 'Conquistas' },
    { id: 'gallery', label: 'Galeria' },
    { id: 'sponsors', label: 'Parceiros' },
    { id: 'support', label: 'Apoio' },
  ];

  const needsSaveButton = activeTab === 'profile' || activeTab === 'support';

  return (
    <div className="max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
          Gerenciar Conteúdo
        </h1>
        {needsSaveButton && (
          <button 
            onClick={handleSaveAll}
            disabled={isSaving}
            className="flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-dark-900 px-6 py-2 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        )}
      </div>

      {saveMessage && (
        <div className={`mb-6 p-4 rounded ${saveMessage.includes('Erro') ? 'bg-red-500/20 border border-red-500/50 text-red-400' : 'bg-green-500/20 border border-green-500/50 text-green-400'}`}>
          {saveMessage}
        </div>
      )}

      <div className="flex overflow-x-auto gap-2 mb-8 border-b border-white/10 pb-4 scrollbar-hide">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setSaveMessage('');
            }}
            className={`px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors whitespace-nowrap rounded-t-lg ${activeTab === tab.id ? 'text-gold-500 bg-white/5 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {activeTab === 'profile' && <ProfileTab setIsSaving={setIsSaving} setSaveMessage={setSaveMessage} />}
        {activeTab === 'timeline' && <TimelineTab />}
        {activeTab === 'stats' && <StatsTab />}
        {activeTab === 'achievements' && <AchievementsTab />}
        {activeTab === 'gallery' && <GalleryTab />}
        {activeTab === 'sponsors' && <SponsorsTab />}
        {activeTab === 'support' && <SupportTab setIsSaving={setIsSaving} setSaveMessage={setSaveMessage} />}
      </div>
    </div>
  );
}
