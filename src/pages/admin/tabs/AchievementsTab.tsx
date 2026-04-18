import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Plus, Trash2, GripVertical, Image as ImageIcon, Edit, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function AchievementsTab() {
  const { achievements, refreshData } = useData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteData, setDeleteData] = useState<{id: string, imageUrl?: string} | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    championship_name: '',
    location: '',
    event_date: new Date().getFullYear().toString(),
    category: '',
    weight_class: '',
    result: '',
    medal: 'none',
    category2: '',
    medal2: 'none',
    category3: '',
    medal3: 'none',
    description: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageUrl = '';
      if (selectedFile) {
        const fileExt = selectedFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `achievements/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('athlete')
          .upload(filePath, selectedFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('athlete')
          .getPublicUrl(filePath);
        
        imageUrl = publicUrl;
      }

      const newItem = {
        ...formData,
        image_url: imageUrl,
        is_featured: false,
        display_order: achievements.length,
        is_visible: true
      };
      
      const { error } = await supabase.from('achievements').insert([newItem]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({
        title: '',
        championship_name: '',
        location: '',
        event_date: new Date().getFullYear().toString(),
        category: '',
        weight_class: '',
        result: '',
        medal: 'none',
        category2: '',
        medal2: 'none',
        category3: '',
        medal3: 'none',
        description: ''
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
      if (deleteData.imageUrl) {
        try {
          const filePath = deleteData.imageUrl.split('/').pop();
          if (filePath) {
            await supabase.storage.from('athlete').remove([`achievements/${filePath}`]);
          }
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      }
      await supabase.from('achievements').delete().eq('id', deleteData.id);
      refreshData();
      setDeleteData(null);
    }
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('achievements').update({ is_visible: !current }).eq('id', id);
    refreshData();
  };

  const handleToggleFeatured = async (id: string, current: boolean) => {
    await supabase.from('achievements').update({ is_featured: !current }).eq('id', id);
    refreshData();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `achievements/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('athlete')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('athlete')
        .getPublicUrl(filePath);

      await supabase.from('achievements').update({ image_url: publicUrl }).eq('id', id);
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

    const items = [...achievements];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index
    }));

    try {
      await Promise.all(updates.map(update => 
        supabase.from('achievements').update({ display_order: update.display_order }).eq('id', update.id)
      ));
      refreshData();
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">Gerencie suas conquistas (Carrossel).</p>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors">
          <Plus size={16} /> Adicionar Conquista
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="achievements-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {achievements.map((ach, index) => (
                // @ts-ignore
                <Draggable key={ach.id} draggableId={ach.id} index={index}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`glass-panel p-4 rounded-lg border ${ach.isVisible ? 'border-white/5' : 'border-red-500/30 opacity-50'}`}
                    >
                      <div className="flex items-center gap-4">
                        <div {...provided.dragHandleProps} className="cursor-grab text-gray-500 hover:text-white">
                          <GripVertical size={20} />
                        </div>
                        <div className="w-16 h-16 bg-dark-800 rounded overflow-hidden shrink-0 relative group">
                          {ach.imageUrl ? (
                            <img src={ach.imageUrl} alt={ach.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500"><ImageIcon size={20} /></div>
                          )}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <label className="cursor-pointer text-white">
                              <Edit size={16} />
                              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, ach.id)} disabled={isUploading} />
                            </label>
                          </div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-white">{ach.title}</h4>
                          <p className="text-sm text-gray-400">{ach.date} • {ach.result}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingId(editingId === ach.id ? null : ach.id)} className="p-2 text-gray-400 hover:text-white bg-white/5 rounded transition-colors">
                            {editingId === ach.id ? 'Fechar' : 'Editar'}
                          </button>
                          <button onClick={() => handleToggleFeatured(ach.id, ach.featured)} className={`p-2 rounded transition-colors text-xs font-bold uppercase ${ach.featured ? 'bg-gold-500/20 text-gold-500' : 'bg-white/5 text-gray-400'}`}>
                            Destaque
                          </button>
                          <button onClick={() => handleToggleVisibility(ach.id, ach.isVisible)} className={`p-2 rounded transition-colors text-xs font-bold uppercase ${ach.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                            {ach.isVisible ? 'Visível' : 'Oculto'}
                          </button>
                          <button onClick={() => setDeleteData({ id: ach.id, imageUrl: ach.imageUrl })} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {editingId === ach.id && (
                        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Título</label>
                            <input type="text" defaultValue={ach.title} onBlur={async (e) => { await supabase.from('achievements').update({ title: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Local</label>
                            <input type="text" defaultValue={ach.location} onBlur={async (e) => { await supabase.from('achievements').update({ location: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Data/Ano</label>
                            <input type="text" defaultValue={ach.date} onBlur={async (e) => { await supabase.from('achievements').update({ event_date: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Categoria 1</label>
                            <input type="text" defaultValue={ach.category} onBlur={async (e) => { await supabase.from('achievements').update({ category: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Medalha 1</label>
                            <select defaultValue={ach.medal} onChange={async (e) => { await supabase.from('achievements').update({ medal: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm">
                              <option value="gold">Ouro</option>
                              <option value="silver">Prata</option>
                              <option value="bronze">Bronze</option>
                              <option value="none">Nenhuma</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Categoria 2</label>
                            <input type="text" defaultValue={ach.category2} onBlur={async (e) => { await supabase.from('achievements').update({ category2: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Medalha 2</label>
                            <select defaultValue={ach.medal2} onChange={async (e) => { await supabase.from('achievements').update({ medal2: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm">
                              <option value="gold">Ouro</option>
                              <option value="silver">Prata</option>
                              <option value="bronze">Bronze</option>
                              <option value="none">Nenhuma</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Categoria 3</label>
                            <input type="text" defaultValue={ach.category3} onBlur={async (e) => { await supabase.from('achievements').update({ category3: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Medalha 3</label>
                            <select defaultValue={ach.medal3} onChange={async (e) => { await supabase.from('achievements').update({ medal3: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm">
                              <option value="gold">Ouro</option>
                              <option value="silver">Prata</option>
                              <option value="bronze">Bronze</option>
                              <option value="none">Nenhuma</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Peso</label>
                            <input type="text" defaultValue={ach.weight} onBlur={async (e) => { await supabase.from('achievements').update({ weight_class: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-400 mb-1">Resultado</label>
                            <input type="text" defaultValue={ach.result} onBlur={async (e) => { await supabase.from('achievements').update({ result: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs text-gray-400 mb-1">Descrição Curta</label>
                            <input type="text" defaultValue={ach.description} onBlur={async (e) => { await supabase.from('achievements').update({ description: e.target.value }).eq('id', ach.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {achievements.length === 0 && (
                <div className="text-center py-10 text-gray-500">Nenhuma conquista adicionada.</div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-900 border border-white/10 rounded-lg p-6 w-full max-w-2xl my-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-white uppercase">Nova Conquista</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Título</label>
                  <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: Campeão Mundial" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome do Campeonato</label>
                  <input type="text" value={formData.championship_name} onChange={e => setFormData({...formData, championship_name: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: IBJJF World Championship" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Local</label>
                  <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: Califórnia, EUA" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Data / Ano</label>
                  <input type="text" value={formData.event_date} onChange={e => setFormData({...formData, event_date: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: 2023" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categoria 1</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: Peso Médio" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Medalha 1</label>
                  <select value={formData.medal} onChange={e => setFormData({...formData, medal: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none">
                    <option value="gold">Ouro</option>
                    <option value="silver">Prata</option>
                    <option value="bronze">Bronze</option>
                    <option value="none">Nenhuma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categoria 2</label>
                  <input type="text" value={formData.category2} onChange={e => setFormData({...formData, category2: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: Absoluto" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Medalha 2</label>
                  <select value={formData.medal2} onChange={e => setFormData({...formData, medal2: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none">
                    <option value="gold">Ouro</option>
                    <option value="silver">Prata</option>
                    <option value="bronze">Bronze</option>
                    <option value="none">Nenhuma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Categoria 3</label>
                  <input type="text" value={formData.category3} onChange={e => setFormData({...formData, category3: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: No-Gi" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Medalha 3</label>
                  <select value={formData.medal3} onChange={e => setFormData({...formData, medal3: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none">
                    <option value="gold">Ouro</option>
                    <option value="silver">Prata</option>
                    <option value="bronze">Bronze</option>
                    <option value="none">Nenhuma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Imagem</label>
                  <input type="file" accept="image/*" onChange={e => setSelectedFile(e.target.files?.[0] || null)} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none text-sm" />
                </div>
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
        title="Excluir Conquista"
        message="Tem certeza que deseja excluir esta conquista?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteData(null)}
      />
    </div>
  );
}
