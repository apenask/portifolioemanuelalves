import React from 'react';
import { useData } from '../../../context/DataContext';
import { Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function SupportTab({ setIsSaving, setSaveMessage }: { setIsSaving: (s: boolean) => void, setSaveMessage: (m: string) => void }) {
  const { support, setSupport } = useData();

  if (!support) return null;

  const handleSupportChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSupport(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSaving(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `support/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('athlete')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('athlete')
        .getPublicUrl(filePath);

      setSupport(prev => prev ? ({ ...prev, imageUrl: publicUrl }) : null);
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-bold text-white uppercase">Visibilidade da Seção</h2>
          <button 
            onClick={() => setSupport(prev => prev ? ({ ...prev, isVisible: !prev.isVisible }) : null)} 
            className={`px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors ${support.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
          >
            {support.isVisible ? 'Seção Visível no Site' : 'Seção Oculta'}
          </button>
        </div>
        <p className="text-sm text-gray-400">Configure a seção "Apoie um Campeão" para captar patrocínios e parcerias.</p>
      </div>

      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Textos Principais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Título</label>
            <input type="text" name="title" value={support.title} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subtítulo</label>
            <input type="text" name="subtitle" value={support.subtitle} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição / Pitch</label>
            <textarea name="description" value={support.description} onChange={handleSupportChange} rows={4} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Imagem da Seção</h2>
        <div>
          <div className="relative aspect-video max-w-md bg-dark-800 rounded overflow-hidden border border-white/10 mb-2 group">
            {support.imageUrl ? (
              <img src={support.imageUrl} alt="Support" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon size={32} /></div>
            )}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <label className="cursor-pointer bg-gold-500 text-dark-900 px-4 py-2 rounded font-bold text-sm uppercase">
                Trocar Imagem
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Botões e Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Texto Botão Principal</label>
            <input type="text" name="primaryButtonText" value={support.primaryButtonText} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Link Botão Principal</label>
            <input type="text" name="primaryButtonLink" value={support.primaryButtonLink} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Texto Botão Secundário</label>
            <input type="text" name="secondaryButtonText" value={support.secondaryButtonText} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Link Botão Secundário</label>
            <input type="text" name="secondaryButtonLink" value={support.secondaryButtonLink} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-lg border border-white/5">
        <h2 className="text-xl font-display font-bold text-white mb-6 uppercase">Contatos Específicos (Opcional)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">WhatsApp (Número)</label>
            <input type="text" name="whatsappNumber" value={support.whatsappNumber} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">E-mail</label>
            <input type="email" name="email" value={support.email} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Instagram</label>
            <input type="text" name="instagramUrl" value={support.instagramUrl} onChange={handleSupportChange} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
