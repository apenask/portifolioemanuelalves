import React from 'react';
import { useData } from '../../../context/DataContext';
import { Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function ProfileTab({ setIsSaving, setSaveMessage }: { setIsSaving: (s: boolean) => void, setSaveMessage: (m: string) => void }) {
  const { profile, setProfile } = useData();

  if (!profile) return null;

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setProfile(prev => prev ? ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }) : null);
    } else {
      setProfile(prev => prev ? ({ ...prev, [name]: value }) : null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'heroImageUrl' | 'aboutImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('athlete')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('athlete')
        .getPublicUrl(filePath);

      setProfile(prev => prev ? ({ ...prev, [field]: publicUrl }) : null);
      setSaveMessage('Imagem enviada! Clique em Salvar para confirmar.');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error: any) {
      console.error("Erro no upload:", error);
      setSaveMessage(`Erro no upload: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Imagens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Foto Principal (Hero)</label>
            <div className="relative aspect-video bg-dark-800 rounded overflow-hidden border border-white/10 mb-2 group">
              {profile.heroImageUrl ? (
                <img src={profile.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon size={32} /></div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-gold-500 text-dark-900 px-4 py-2 rounded font-bold text-sm uppercase">
                  Trocar Imagem
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'heroImageUrl')} />
                </label>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Foto Sobre</label>
            <div className="relative aspect-[3/4] max-h-48 bg-dark-800 rounded overflow-hidden border border-white/10 mb-2 group">
              {profile.aboutImageUrl ? (
                <img src={profile.aboutImageUrl} alt="Sobre" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon size={32} /></div>
              )}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer bg-gold-500 text-dark-900 px-4 py-2 rounded font-bold text-sm uppercase">
                  Trocar Imagem
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, 'aboutImageUrl')} />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Informações Básicas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome</label>
            <input type="text" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subtítulo (Hero)</label>
            <input type="text" name="subtitle" value={profile.subtitle} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição Curta (Hero)</label>
            <textarea name="heroDescription" value={profile.heroDescription} onChange={handleProfileChange} rows={2} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Biografia Completa</label>
            <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows={4} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Frase de Impacto</label>
            <input type="text" name="impactPhrase" value={profile.impactPhrase} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Detalhes do Atleta</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categoria</label>
            <input type="text" name="category" value={profile.category} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Faixa</label>
            <input type="text" name="belt" value={profile.belt} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Equipe</label>
            <input type="text" name="team" value={profile.team} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cidade</label>
            <input type="text" name="city" value={profile.city} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Estado</label>
            <input type="text" name="state" value={profile.state} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data de Início (YYYY-MM-DD)</label>
            <input type="date" name="startDate" value={profile.startDate} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Redes Sociais & Contato</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Instagram (URL)</label>
            <input type="text" name="social.instagram" value={profile.social.instagram} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp (Apenas números)</label>
            <input type="text" name="social.whatsapp" value={profile.social.whatsapp} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</label>
            <input type="email" name="social.email" value={profile.social.email} onChange={handleProfileChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
