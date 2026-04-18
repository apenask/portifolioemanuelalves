import React, { useState } from 'react';
import { useData } from '../../../context/DataContext';
import { Plus, Trash2, GripVertical, Image as ImageIcon, X } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import ConfirmModal from '../../../components/admin/ConfirmModal';

export default function GalleryTab() {
  const { galleryCategories, gallery, refreshData } = useData();
  const [activeSubTab, setActiveSubTab] = useState<'images' | 'categories'>('images');
  const [isUploading, setIsUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteCategoryData, setDeleteCategoryData] = useState<string | null>(null);
  const [deleteImageData, setDeleteImageData] = useState<{id: string, imageUrl: string} | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: ''
  });

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      const newItem = {
        name: formData.name,
        slug,
        display_order: galleryCategories.length,
        is_visible: true
      };
      const { error } = await supabase.from('gallery_categories').insert([newItem]);
      if (error) throw error;
      
      setIsModalOpen(false);
      setFormData({ name: '', slug: '' });
      await refreshData();
    } catch (error: any) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (deleteCategoryData) {
      await supabase.from('gallery_categories').delete().eq('id', deleteCategoryData);
      refreshData();
      setDeleteCategoryData(null);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `gallery/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('athlete')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('athlete')
          .getPublicUrl(filePath);

        await supabase.from('gallery').insert([{
          image_url: publicUrl,
          title: 'Nova Imagem',
          display_order: gallery.length + i,
          is_visible: true
        }]);
      }
      refreshData();
    } catch (error: any) {
      console.error("Erro no upload:", error);
      alert(`Erro no upload: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    if (deleteImageData) {
      try {
        const filePath = deleteImageData.imageUrl.split('/').pop();
        if (filePath) {
          await supabase.storage.from('athlete').remove([`gallery/${filePath}`]);
        }
      } catch (error) {
        console.error("Error deleting image:", error);
      }
      await supabase.from('gallery').delete().eq('id', deleteImageData.id);
      refreshData();
      setDeleteImageData(null);
    }
  };

  const onDragEndCategories = async (result: DropResult) => {
    if (!result.destination) return;

    const items = [...galleryCategories];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index
    }));

    try {
      await Promise.all(updates.map(update => 
        supabase.from('gallery_categories').update({ display_order: update.display_order }).eq('id', update.id)
      ));
      refreshData();
    } catch (error) {
      console.error("Error reordering categories:", error);
    }
  };

  const onDragEndImages = async (result: DropResult) => {
    if (!result.destination) return;

    const items = [...gallery];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updates = items.map((item, index) => ({
      id: item.id,
      display_order: index
    }));

    try {
      await Promise.all(updates.map(update => 
        supabase.from('gallery').update({ display_order: update.display_order }).eq('id', update.id)
      ));
      refreshData();
    } catch (error) {
      console.error("Error reordering images:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b border-white/10 pb-4">
        <button 
          onClick={() => setActiveSubTab('images')}
          className={`px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors ${activeSubTab === 'images' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
        >
          Imagens
        </button>
        <button 
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2 font-bold uppercase tracking-wider text-sm transition-colors ${activeSubTab === 'categories' ? 'text-gold-500 border-b-2 border-gold-500' : 'text-gray-400 hover:text-white'}`}
        >
          Categorias
        </button>
      </div>

      {activeSubTab === 'categories' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Gerencie as categorias do filtro da galeria.</p>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors">
              <Plus size={16} /> Nova Categoria
            </button>
          </div>
          
          <DragDropContext onDragEnd={onDragEndCategories}>
            <Droppable droppableId="categories-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {galleryCategories.map((cat, index) => (
                    // @ts-ignore
                    <Draggable key={cat.id} draggableId={cat.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="glass-panel p-4 rounded-lg border border-white/5 flex items-center gap-4"
                        >
                          <div {...provided.dragHandleProps} className="cursor-grab text-gray-500 hover:text-white">
                            <GripVertical size={20} />
                          </div>
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Nome</label>
                              <input type="text" defaultValue={cat.name} onBlur={async (e) => { await supabase.from('gallery_categories').update({ name: e.target.value }).eq('id', cat.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Slug (URL amigável)</label>
                              <input type="text" defaultValue={cat.slug} onBlur={async (e) => { await supabase.from('gallery_categories').update({ slug: e.target.value }).eq('id', cat.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-3 py-1 text-white text-sm" />
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={async () => {
                              await supabase.from('gallery_categories').update({ is_visible: !cat.isVisible }).eq('id', cat.id);
                              refreshData();
                            }} className={`p-2 rounded transition-colors text-xs font-bold uppercase ${cat.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                              {cat.isVisible ? 'Visível' : 'Oculto'}
                            </button>
                            <button onClick={() => setDeleteCategoryData(cat.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {isModalOpen && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-dark-900 border border-white/10 rounded-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-display font-bold text-white uppercase">Nova Categoria</h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={24} />
                  </button>
                </div>
                <form onSubmit={handleAddCategory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nome</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: Treinos" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Slug (Opcional)</label>
                    <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-dark-800 border border-white/10 rounded px-4 py-2 text-white focus:border-gold-500 outline-none" placeholder="Ex: treinos" />
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
        </div>
      )}

      {activeSubTab === 'images' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-gray-400 text-sm">Faça upload e organize suas fotos.</p>
            <label className={`flex items-center gap-2 bg-gold-500 hover:bg-gold-400 text-dark-900 px-4 py-2 rounded text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
              <Plus size={16} /> {isUploading ? 'Enviando...' : 'Upload de Imagens'}
              <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
          </div>

          <DragDropContext onDragEnd={onDragEndImages}>
            <Droppable droppableId="images-list">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((img, index) => (
                    // @ts-ignore
                    <Draggable key={img.id} draggableId={img.id} index={index}>
                      {(provided) => (
                        <div 
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`glass-panel p-3 rounded-lg border ${img.isVisible ? 'border-white/5' : 'border-red-500/30 opacity-50'}`}
                        >
                          <div className="aspect-video bg-dark-800 rounded overflow-hidden mb-3 relative group">
                            {img.url ? (
                              <img src={img.url || undefined} alt={img.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500"><ImageIcon size={24} /></div>
                            )}
                            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div {...provided.dragHandleProps} className="p-1.5 rounded bg-dark-900/80 backdrop-blur text-white cursor-grab hover:bg-black/80">
                                <GripVertical size={16} />
                              </div>
                              <button onClick={async () => {
                                await supabase.from('gallery').update({ is_visible: !img.isVisible }).eq('id', img.id);
                                refreshData();
                              }} className={`p-1.5 rounded bg-dark-900/80 backdrop-blur text-xs font-bold uppercase ${img.isVisible ? 'text-green-400' : 'text-red-400'}`}>
                                {img.isVisible ? 'Visível' : 'Oculto'}
                              </button>
                              <button onClick={() => setDeleteImageData({ id: img.id, imageUrl: img.url })} className="p-1.5 rounded bg-dark-900/80 backdrop-blur text-red-400 hover:text-red-300">
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Categoria</label>
                              <select defaultValue={img.categoryId || ''} onChange={async (e) => { await supabase.from('gallery').update({ category_id: e.target.value || null }).eq('id', img.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-2 py-1 text-white text-xs">
                                <option value="">Sem categoria</option>
                                {galleryCategories.map(c => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Legenda</label>
                              <input type="text" defaultValue={img.caption} onBlur={async (e) => { await supabase.from('gallery').update({ caption: e.target.value }).eq('id', img.id); refreshData(); }} className="w-full bg-dark-800 border border-white/10 rounded px-2 py-1 text-white text-xs" placeholder="Legenda opcional..." />
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      <ConfirmModal
        isOpen={!!deleteCategoryData}
        title="Excluir Categoria"
        message="Tem certeza? Imagens desta categoria ficarão sem categoria."
        onConfirm={handleDeleteCategory}
        onCancel={() => setDeleteCategoryData(null)}
      />

      <ConfirmModal
        isOpen={!!deleteImageData}
        title="Excluir Imagem"
        message="Tem certeza que deseja excluir esta imagem?"
        onConfirm={handleDeleteImage}
        onCancel={() => setDeleteImageData(null)}
      />
    </div>
  );
}

