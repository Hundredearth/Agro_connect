import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRole } from '../context/RoleContext';
import { Plus, Edit3, Trash2, Package, Search, DollarSign, Tag, Landmark, X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Inventory = () => {
  const { role, profile, t } = useRole();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Add product form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [place, setPlace] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit product state
  const [editingProduct, setEditingProduct] = useState(null);

  const fetchProducts = async () => {
    if (!profile?.id) return;
    try {
      const res = await axios.get(`/api/seller-products/seller/${profile.id}`);
      setProducts(res.data);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load seller products', e);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [profile]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;
    setSubmitting(true);
    
    // Combine description and location (place)
    const combinedDescription = place 
      ? `${description}\nLocation: ${place}`
      : description;

    try {
      await axios.post('/api/seller-products', {
        sellerId: profile.id,
        name,
        description: combinedDescription,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: imageUrl || undefined
      });
      
      // Reset form
      setName('');
      setDescription('');
      setPlace('');
      setPrice('');
      setStock('');
      setImageUrl('');
      setIsAddOpen(false);
      fetchProducts();
    } catch (e) {
      console.error('Add product error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSubmitting(true);

    const combinedDescription = editingProduct.place 
      ? `${editingProduct.descriptionRaw}\nLocation: ${editingProduct.place}`
      : editingProduct.descriptionRaw;

    try {
      await axios.put(`/api/seller-products/${editingProduct.id}`, {
        name: editingProduct.name,
        description: combinedDescription,
        price: parseFloat(editingProduct.price),
        stock: parseInt(editingProduct.stock),
        imageUrl: editingProduct.imageUrl
      });
      setEditingProduct(null);
      fetchProducts();
    } catch (e) {
      console.error('Update product error:', e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id, currentStock) => {
    if (currentStock > 0) {
      alert('Cannot delete listing! Stock must be empty (0) to delete this item.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      await axios.delete(`/api/seller-products/${id}`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      console.error('Delete product error:', e);
    }
  };

  const openEditModal = (product) => {
    // Parse combined description to raw description and place
    let descriptionRaw = product.description || '';
    let placeParsed = '';
    const locIndex = descriptionRaw.indexOf('\nLocation: ');
    if (locIndex !== -1) {
      placeParsed = descriptionRaw.substring(locIndex + 11);
      descriptionRaw = descriptionRaw.substring(0, locIndex);
    }

    setEditingProduct({
      ...product,
      descriptionRaw,
      place: placeParsed,
      price: product.price.toString(),
      stock: product.stock.toString(),
    });
  };

  if (role !== 'seller') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
        <Package size={64} className="text-outline-variant mb-4" />
        <h2 className="font-display-lg text-primary text-2xl font-black">{t("Access Restricted")}</h2>
        <p className="text-on-surface-variant text-sm mt-1 max-w-[280px]">{t("Only sellers can manage input inventory here.")}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-primary/60">{t("Loading inventory...")}</p>
      </div>
    );
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-4 space-y-6 pb-36 relative">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="font-display-lg text-primary text-2xl leading-none">{t("Store Inventory")}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t("Manage your agricultural supplies")}</p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all"
        >
          <Plus size={24} />
        </button>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl border border-surface-container/40">
          <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-wider">{t("Total Stock")}</p>
          <p className="text-xl font-black text-primary mt-1">{totalStock} {t("Units")}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl border border-surface-container/40">
          <p className="text-[9px] font-black text-on-surface-variant/50 uppercase tracking-wider">{t("Active Items")}</p>
          <p className="text-xl font-black text-secondary mt-1">{products.length} {t("Listings")}</p>
        </div>
      </section>

      {/* Search Field */}
      <section className="glass-card p-3.5 rounded-2xl flex items-center gap-3 border border-surface-container/40 bg-white/40">
        <Search size={18} className="text-on-surface-variant/40" />
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent border-none focus:outline-none w-full text-sm text-primary placeholder:text-on-surface-variant/30" 
          placeholder={t("Search inventory products...")} 
        />
      </section>

      {/* Inventory Listings */}
      {filteredProducts.length === 0 ? (
        <div className="glass-card p-10 rounded-[32px] border border-surface-container/40 bg-white/40 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <Package size={32} />
          </div>
          <h3 className="font-bold text-primary text-lg">{t("No stock items listed")}</h3>
          <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[240px]">
            {t("Add fertilizer, seeds, or other tools so farmers can purchase them!")}
          </p>
          <button
            onClick={() => setIsAddOpen(true)}
            className="mt-6 bg-primary text-on-primary px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md"
          >
            {t("Create First Listing")}
          </button>
        </div>
      ) : (
        <section className="space-y-4">
          {filteredProducts.map(product => {
            // Parse combined location and description
            let displayDesc = product.description || '';
            let displayLoc = 'N/A';
            const locIdx = displayDesc.indexOf('\nLocation: ');
            if (locIdx !== -1) {
              displayLoc = displayDesc.substring(locIdx + 11);
              displayDesc = displayDesc.substring(0, locIdx);
            }

            return (
              <div key={product.id} className="glass-card p-4 rounded-[32px] border border-surface-container/50 bg-white/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container shrink-0 border border-white/50 relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-container to-primary/20 flex items-center justify-center text-primary">
                        <Package size={28} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-primary text-base line-clamp-1">{product.name}</h4>
                    <p className="text-[10px] text-on-surface-variant/50 font-black uppercase tracking-wider mt-0.5">{t("Seller listing")}</p>
                    <p className="text-[11px] text-on-surface-variant/70 mt-1 line-clamp-2 leading-relaxed">{displayDesc || t('High quality agricultural farming inputs.')}</p>
                    
                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 items-center">
                      <div className="flex items-center text-xs font-black text-secondary gap-0.5">
                        <Tag size={12} />
                        <span>${product.price}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
                      <div className="flex items-center text-xs font-bold text-primary gap-0.5">
                        <Package size={12} />
                        <span>{product.stock} {t("units in stock")}</span>
                      </div>
                      {displayLoc && displayLoc !== 'N/A' && (
                        <>
                          <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
                          <div className="flex items-center text-xs font-medium text-on-surface-variant/70 gap-0.5">
                            <Landmark size={12} />
                            <span>{displayLoc}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-surface-container/30 flex justify-end gap-2">
                  <button 
                    onClick={() => openEditModal(product)}
                    className="px-4 py-2 text-primary bg-primary/5 hover:bg-primary/10 rounded-full text-[10px] font-black uppercase tracking-wider transition-colors active:scale-95 flex items-center gap-1.5 border border-primary/10"
                  >
                    <Edit3 size={12} />
                    {t("Edit Details")}
                  </button>
                  <button 
                    onClick={() => handleDeleteProduct(product.id, product.stock)}
                    disabled={product.stock > 0}
                    className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 flex items-center gap-1.5 ${
                      product.stock > 0
                        ? 'opacity-40 bg-surface-container text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/10'
                        : 'text-error bg-error/5 hover:bg-error/10 border border-error/10'
                    }`}
                    title={product.stock > 0 ? "Empty stock first before deleting" : "Delete listing"}
                  >
                    <Trash2 size={12} />
                    {t("Delete List")}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Elegant Add Listing Form Overlay */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card bg-white/95 rounded-[36px] w-full max-w-[380px] p-6 shadow-2xl relative z-10 border border-white overflow-y-auto max-h-[85vh] no-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display-lg text-primary text-xl font-black">{t("List New Product")}</h3>
                  <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{t("Add stock item to store")}</p>
                </div>
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="bg-surface-container/50 text-primary p-2 rounded-full active:scale-90 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Product Name")}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("e.g. Organic Tomato Seeds")}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Description")}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("Provide details about active ingredients, benefits...")}
                    rows={2}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Location / Place")}</label>
                  <input
                    type="text"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    placeholder={t("e.g. Sector C Warehouse, City Center")}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Price ($)")}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={t("e.g. 14.99")}
                      className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Initial Stock")}</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder={t("e.g. 50")}
                      className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Image URL (Optional)")}</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/item.jpg"
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Plus size={16} />
                      {t("Publish Store Product")}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Elegant Edit Modal Overlay */}
      <AnimatePresence>
        {editingProduct && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingProduct(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="glass-card bg-white/95 rounded-[36px] w-full max-w-[380px] p-6 shadow-2xl relative z-10 border border-white overflow-y-auto max-h-[85vh] no-scrollbar"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-display-lg text-primary text-xl font-black">{t("Edit Listing")}</h3>
                  <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{t("Update stock item details")}</p>
                </div>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="bg-surface-container/50 text-primary p-2 rounded-full active:scale-90 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleUpdateProduct} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Product Name")}</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                    placeholder={t("Product Name")}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Description")}</label>
                  <textarea
                    value={editingProduct.descriptionRaw}
                    onChange={(e) => setEditingProduct({...editingProduct, descriptionRaw: e.target.value})}
                    placeholder={t("Product Description")}
                    rows={2}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Location / Place")}</label>
                  <input
                    type="text"
                    value={editingProduct.place}
                    onChange={(e) => setEditingProduct({...editingProduct, place: e.target.value})}
                    placeholder={t("Warehouse Location")}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                      placeholder="Price"
                      className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={editingProduct.stock}
                      onChange={(e) => setEditingProduct({...editingProduct, stock: e.target.value})}
                      placeholder="Stock quantity"
                      className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">Image URL (Optional)</label>
                  <input
                    type="url"
                    value={editingProduct.imageUrl || ''}
                    onChange={(e) => setEditingProduct({...editingProduct, imageUrl: e.target.value})}
                    placeholder="https://example.com/item.jpg"
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-[11px] uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Edit3 size={16} />
                      {t("Save Product Listing")}
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;
