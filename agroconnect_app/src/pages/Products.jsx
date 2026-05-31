import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { Package, ListOrdered, CheckCircle2, X, ChevronRight, Plus, Trash2, DollarSign, Tag, ShoppingBag, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Products = () => {
  const navigate = useNavigate();
  const { role, profile, t } = useRole();
  const [products, setProducts] = useState([]);
  const [requestsMap, setRequestsMap] = useState({}); // productId => [requests]
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null); // productId of opened request list
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form states for adding produce
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    if (!profile?.id) return;
    try {
      const [prodRes, reqRes] = await Promise.all([
        axios.get(`/api/produce/farmer/${profile.id}`),
        axios.get(`/api/purchase-requests/farmer/${profile.id}`)
      ]);
      setProducts(prodRes.data);
      // Group requests by productId
      const map = {};
      reqRes.data.forEach((req) => {
        const pid = req.produceId;
        if (!map[pid]) map[pid] = [];
        map[pid].push(req);
      });
      setRequestsMap(map);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load farmer products or requests', e);
      setLoading(false);
    }
  };

  // Fetch products and purchase requests for the logged‑in farmer
  useEffect(() => {
    fetchData();
  }, [profile]);

  const handleApprove = async (requestId, productId) => {
    try {
      await axios.patch(`/api/purchase-requests/${requestId}/status`, { status: 'APPROVED' });
      // Refresh data
      fetchData();
    } catch (e) {
      console.error('Approve error', e);
    }
  };

  const handleReject = async (requestId, productId) => {
    try {
      await axios.patch(`/api/purchase-requests/${requestId}/status`, { status: 'REJECTED' });
      // Refresh data
      fetchData();
    } catch (e) {
      console.error('Reject error', e);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this produce listing?')) return;
    try {
      await axios.delete(`/api/produce/${productId}`);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (e) {
      console.error('Delete produce error', e);
    }
  };

  const handleCreateProduce = async (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;
    setSubmitting(true);
    try {
      await axios.post('/api/produce', {
        farmerId: profile.id,
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock),
        imageUrl: imageUrl || undefined
      });
      setIsAddModalOpen(false);
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      setImageUrl('');
      fetchData();
    } catch (e) {
      console.error('Create produce error', e);
    } finally {
      setSubmitting(false);
    }
  };

  if (role !== 'farmer') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
        <ListOrdered size={64} className="text-outline-variant mb-4" />
        <h2 className="font-display-lg text-primary text-2xl font-black">{t("Access Denied")}</h2>
        <p className="text-on-surface-variant text-sm mt-1 max-w-[280px]">
          {t("Only farmer accounts can view product listings.")}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-primary text-on-primary py-3.5 px-8 rounded-full font-black text-[11px] uppercase tracking-widest active:scale-95 transition-all shadow-lg"
        >
          {t("Go Home")}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-primary/60">{t("Loading products...")}</p>
      </div>
    );
  }

  // Fallback high-quality farm gradients
  const gradients = [
    'from-emerald-400 to-teal-500',
    'from-green-400 to-emerald-500',
    'from-teal-400 to-cyan-500',
    'from-lime-400 to-green-500'
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 pt-4 space-y-6 pb-36 relative">
      <header className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="font-display-lg text-primary text-2xl leading-none">{t("My Produce")}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">
            {t("Manage listings & purchase requests")}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-12 h-12 bg-primary text-on-primary rounded-2xl flex items-center justify-center shadow-lg active:scale-90 hover:scale-105 transition-all"
        >
          <Plus size={24} />
        </button>
      </header>

      {products.length === 0 ? (
        <div className="glass-card p-10 rounded-[32px] border border-surface-container/50 bg-white/40 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
            <Package size={32} />
          </div>
          <h3 className="font-bold text-primary text-lg">{t("No produces listed yet")}</h3>
          <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[240px]">
            {t("Start listing your freshly harvested crops to get orders from customers!")}
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-6 bg-primary text-on-primary px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all shadow-md"
          >
            {t("List First Produce")}
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4">
          {products.map((product, idx) => {
            const pending = (requestsMap[product.id] || []).filter((r) => r.status === 'REQUESTED');
            const gradient = gradients[idx % gradients.length];
            return (
              <div key={product.id} className="glass-card p-4 rounded-[32px] border border-surface-container/50 bg-white/60 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="flex gap-4">
                  {/* Styled Image/Gradient Container */}
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/50 bg-surface-container">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white/90`}>
                        <Package size={28} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex-grow min-w-0 flex flex-col justify-center">
                    <h3 className="font-bold text-primary text-base line-clamp-1">{product.name}</h3>
                    <p className="text-[11px] text-on-surface-variant/75 mt-0.5 line-clamp-2 leading-relaxed pr-2">
                      {product.description || t('Fresh produce straight from our local farm fields.')}
                    </p>
                    
                    <div className="flex gap-3 items-center mt-2">
                      <div className="flex items-center text-xs font-black text-primary gap-0.5">
                        <Tag size={12} className="text-secondary" />
                        <span>${product.price}/kg</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
                      <div className="flex items-center text-xs font-bold text-on-surface-variant/70 gap-0.5">
                        <ShoppingBag size={12} />
                        <span>{product.stock} {t("kg in stock")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions & Pending Section */}
                <div className="mt-4 pt-3 border-t border-surface-container/30 flex justify-between items-center">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-on-surface-variant/40 hover:text-error transition-colors p-2 rounded-xl active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>

                  {pending.length > 0 ? (
                    <button
                      onClick={() => setExpanded(expanded === product.id ? null : product.id)}
                      className="bg-error/10 text-error px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 active:scale-95 transition-all animate-pulse"
                    >
                      <Eye size={12} />
                      {pending.length} {t("Requests Pending")}
                    </button>
                  ) : (
                    <span className="text-[9px] uppercase tracking-wider font-black text-secondary-container bg-secondary/15 px-3 py-1.5 rounded-full text-secondary">
                      {t("Listing Active")}
                    </span>
                  )}
                </div>

                {/* Expanded Requests Section */}
                <AnimatePresence>
                  {expanded === product.id && pending.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-3 border-t border-dashed border-surface-container/50 space-y-2 overflow-hidden"
                    >
                      <p className="text-[9px] font-black uppercase tracking-widest text-primary/50 mb-2">{t("Pending Customer Orders")}</p>
                      {pending.map((req) => (
                        <div key={req.id} className="p-3.5 rounded-2xl border border-white bg-white/40 shadow-sm flex justify-between items-center gap-2">
                          <div className="text-xs">
                            <p className="font-bold text-primary">{req.customer?.fullName || t('Customer')}</p>
                            <p className="text-on-surface-variant/60 text-[10px]">{req.customer?.phone || t('No phone')}</p>
                            <p className="font-black text-secondary text-[11px] mt-1">{req.quantity} {t("kg ordered")}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleApprove(req.id, product.id)}
                              className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow hover:scale-105 active:scale-90 transition-all"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              onClick={() => handleReject(req.id, product.id)}
                              className="w-8 h-8 rounded-xl bg-error/10 text-error flex items-center justify-center hover:scale-105 active:scale-90 transition-all"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </section>
      )}

      {/* Elegant Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
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
                  <h3 className="font-display-lg text-primary text-xl font-black">{t("List Produce")}</h3>
                  <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{t("Post to customer shop")}</p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-surface-container/50 text-primary p-2 rounded-full active:scale-90 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreateProduce} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Produce Name")}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("e.g. Organic Tomatoes")}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Description")}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t("Describe harvest date, variety, crop quality...")}
                    rows={3}
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Price ($ / kg)")}</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder={t("e.g. 4.50")}
                      className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-widest text-primary/50">{t("Stock (kg)")}</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder={t("e.g. 150")}
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
                    placeholder="https://example.com/image.jpg"
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
                      {t("List Produce Listing")}
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

export default Products;
