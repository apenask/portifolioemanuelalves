import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Plus, Trash2, GripVertical, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function TimelineTab() {
  const { timeline, refreshData } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    year_label: new Date().getFullYear().toString(),
    title: '',
    description: ''
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const newItem = {
        ...formData,
        display_order: timeline.length,
        is_visible: true
      };
      const { error } = await supabase.from('timeline_items').insert([newItem]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ year_label: new Date().getFullYear().toString(), title: '', description: '' });
      await refreshData();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (deleteId) {
      await supabase.from('timeline_items').delete().eq('id', deleteId);
      refreshData();
      setDeleteId(null);
    }
  };

  const handleToggleVisibility = async (id: string, current: boolean) => {
    await supabase.from('timeline_items').update({ is_visible: !current }).eq('id', id);
    refreshData();
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = [...timeline];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index
    }));

    try {
      await Promise.all(updates.map(update => 
        supabase.from('timeline_items').update({ display_order: update.display_order }).eq('id', update.id)
      ));
      refreshData();
    } catch (error) {
      console.error("Error reordering:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-gray-400 text-sm">Gerencie os marcos da sua trajetória.</p>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors">
          <Plus size={16} /> Adicionar Marco
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="timeline-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
              {timeline.map((item, index) => (
                // @ts-ignore
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div 
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`glass-panel p-4 rounded-lg border flex items-center gap-4 ${item.isVisible ? 'border-white/5' : 'border-red-500/30 opacity-50'}`}
                    >
                      <div {...provided.dragHandleProps} className="cursor-grab text-gray-500 hover:text-white">
                        <GripVertical size={20} />
                      </div>
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">Ano/Label</label>
                          <input type="text" defaultValue={item.yearLabel} onBlur={async (e) => { await supabase.from('timeline_items').update({ year_label: e.target.value }).eq('id', item.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                        </div>
                        <div className="md:col-span-3">
                          <label className="block text-xs text-gray-400 mb-1">Título</label>
                          <input type="text" defaultValue={item.title} onBlur={async (e) => { await supabase.from('timeline_items').update({ title: e.target.value }).eq('id', item.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                        </div>
                        <div className="md:col-span-4">
                          <label className="block text-xs text-gray-400 mb-1">Descrição</label>
                          <textarea defaultValue={item.description} onBlur={async (e) => { await supabase.from('timeline_items').update({ description: e.target.value }).eq('id', item.id); refreshData(); }} rows={2} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <button onClick={() => handleToggleVisibility(item.id, item.isVisible)} className={`p-2 rounded transition-colors text-xs font-bold uppercase ${item.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {item.isVisible ? 'Visível' : 'Oculto'}
                        </button>
                        <button onClick={() => setDeleteId(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors flex justify-center">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {timeline.length === 0 && (
                <div className="text-center py-10 text-gray-500">Nenhum marco adicionado.</div>
              )}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-white/10 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-display font-bold text-white uppercase">Novo Marco</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Ano / Label</label>
                <input required type="text" value={formData.year_label} onChange={e => setFormData({...formData, year_label: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: 2023" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Título</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: Faixa Preta" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Descrição</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Detalhes do marco..." />
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
        isOpen={!!deleteId}
        title="Excluir Marco"
        message="Tem certeza que deseja excluir este marco da trajetória?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
