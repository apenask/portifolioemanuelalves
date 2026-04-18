import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Edit, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function SponsorsTab() {
  const { sponsors, refreshData } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteData, setDeleteData] = useState<{id: string, logoUrl?: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    external_link: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let logoUrl = '';
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `sponsors/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('athlete')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('athlete')
          .getPublicUrl(filePath);
        
        logoUrl = publicUrl;
      }

      const newItem = {
        ...formData,
        logo_url: logoUrl,
        display_order: sponsors.length,
        is_visible: true
      };
      
      const { error } = await supabase.from('sponsors').insert([newItem]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({
        name: '',
        description: '',
        external_link: ''
      });
      setSelectedFile(null);
      await refreshData();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteData) {
      if (deleteData.logoUrl) {
        try {
          const filePath = deleteData.logoUrl.split('/').pop();
          if (filePath) {
            await supabase.storage.from('athlete').remove([`sponsors/${filePath}`]);
          }
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
      await supabase.from('sponsors').delete().eq('id', deleteData.id);
      refreshData();
      setDeleteData(null);
    }
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('sponsors').update({ is_visible: !current }).eq('id', id);
    refreshData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `sponsors/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('athlete')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('athlete')
        .getPublicUrl(filePath);

      await supabase.from('sponsors').update({ logo_url: publicUrl }).eq('id', id);
      refreshData();
    } catch (error: any) {
      console.error("Erro no upload:", error);
      alert(`Erro no upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = [...sponsors];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index
    }));

    try {
      await Promise.all(updates.map(update => 
        supabase.from('sponsors').update({ display_order: update.display_order }).eq('id', update.id)
      ));
      refreshData();
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">Gerencie seus patrocinadores e parceiros oficiais.</p>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors">
          <Plus size={16} /> Adicionar Parceiro
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="sponsors-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {sponsors.map((sponsor, index) => (
                // @ts-ignore
                <Draggable key={sponsor.id} draggableId={sponsor.id} index={index}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`glass-panel p-4 rounded-lg border ${sponsor.isVisible ? 'border-white/5' : 'border-red-500/30 opacity-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps} className="cursor-grab text-gray-500 hover:text-white">
                          <GripVertical size={20} />
                        </div>
                        <div className="w-16 h-16 bg-white rounded overflow-hidden shrink-0 relative group p-2 flex items-center justify-center">
                          {sponsor.logoUrl ? (
                            <img src={sponsor.logoUrl || undefined} alt={sponsor.name} className="max-w-full max-h-full object-contain" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500"><ImageIcon size={20} /></div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer text-white">
                              <Edit size={16} />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, sponsor.id)} disabled={isUploading} />
                            </label>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{sponsor.name}</h4>
                          <p className="text-sm text-gray-400 truncate max-w-md">{sponsor.link || 'Sem link'}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingId(editingId === sponsor.id ? null : sponsor.id)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded transition-colors">
                            {editingId === sponsor.id ? 'Fechar' : 'Editar'}
                          </button>
                          <button onClick={() => handleToggleVisibility(sponsor.id, sponsor.isVisible)} className={`p-2 rounded transition-colors text-xs font-bold uppercase ${sponsor.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {sponsor.isVisible ? 'Visível' : 'Oculto'}
                          </button>
                          <button onClick={() => setDeleteData({ id: sponsor.id, logoUrl: sponsor.logoUrl })} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {editingId === sponsor.id && (
                        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Nome da Empresa</label>
                            <input type="text" defaultValue={sponsor.name} onBlur={async (e) => { await supabase.from('sponsors').update({ name: e.target.value }).eq('id', sponsor.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Link do Site/Instagram</label>
                            <input type="text" defaultValue={sponsor.link} onBlur={async (e) => { await supabase.from('sponsors').update({ external_link: e.target.value }).eq('id', sponsor.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">Descrição Curta</label>
                            <textarea defaultValue={sponsor.description} onBlur={async (e) => { await supabase.from('sponsors').update({ description: e.target.value }).eq('id', sponsor.id); refreshData(); }} rows={2} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {sponsors.length === 0 && (
                <div className="text-center py-10 text-gray-500">Nenhum parceiro adicionado.</div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-900 border border-white/10 rounded-lg p-6 w-full max-w-md my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-white uppercase">Novo Parceiro</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome da Empresa</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: Kimonos XYZ" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Link do Site/Instagram</label>
                <input type="text" value={formData.external_link} onChange={e => setFormData({...formData, external_link: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição Curta</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={2} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Patrocinador oficial..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Logo</label>
                <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none text-sm" />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-400 hover:text-white uppercase text-sm font-bold">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="bg-gold-500 hover:bg-gold-400 text-dark-900 px-6 py-2 rounded font-bold uppercase text-sm disabled:opacity-50">
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteData}
        title="Excluir Parceiro"
        message="Tem certeza que deseja excluir este parceiro?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteData(null)}
      />
    </div>
  );
}
