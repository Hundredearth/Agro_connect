import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRole } from '../context/RoleContext';
import { Search, Bell, Star, ShoppingCart, Droplet, Leaf, Shield, Heart, Package, Landmark, ShoppingBag, Check, X, Phone, MapPin, Clock } from 'lucide-react';
import BuyQuantityModal from '../components/BuyQuantityModal';
import { motion, AnimatePresence } from 'framer-motion';

const Supplies = () => {
  const { role, profile, t } = useRole();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Notification states
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [farmerOrders, setFarmerOrders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Purchase Modal state
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/seller-products');
      setProducts(res.data);
      setLoading(false);
    } catch (e) {
      console.error('Failed to load marketplace products', e);
      setLoading(false);
    }
  };

  const fetchFarmerOrders = async () => {
    if (!profile?.id) return;
    try {
      const res = await axios.get(`/api/seller-orders/farmer/${profile.id}`);
      setFarmerOrders(res.data);
      
      // Calculate unread count (e.g. APPROVED or REJECTED orders)
      const count = res.data.filter(order => order.status === 'APPROVED' || order.status === 'REJECTED').length;
      setUnreadCount(count);
    } catch (e) {
      console.error('Failed to load farmer orders for notifications', e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (profile?.id) {
      fetchFarmerOrders();
    }
  }, [profile]);

  const handlePurchase = async (productId, quantity) => {
    if (!profile?.id) {
      alert('Please log in to make a purchase.');
      return;
    }
    try {
      await axios.post('/api/seller-orders', {
        sellerProductId: productId,
        farmerId: profile.id,
        quantity: parseInt(quantity)
      });
      setSuccessMessage('Order request submitted successfully to the seller!');
      setTimeout(() => setSuccessMessage(''), 4000);
      fetchProducts(); // Refresh products to see potentially updated stock
      fetchFarmerOrders(); // Refresh notifications
    } catch (e) {
      console.error('Purchase request error:', e);
      alert('Failed to submit order request.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-primary/60">{t('Loading...')}</p>
      </div>
    );
  }

  // Filter products by category and search query
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedCategory === 'All') return matchesSearch;
    
    // Parse category from name or description
    const pCategory = p.name.toLowerCase().includes('seed') ? 'Seeds' :
                      p.name.toLowerCase().includes('fertilizer') ? 'Fertilizer' :
                      p.name.toLowerCase().includes('tool') || p.name.toLowerCase().includes('spade') ? 'Tools' : 'Chemicals';
    
    return matchesSearch && pCategory === selectedCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 pt-4 space-y-6 pb-36 relative box-border min-w-0">
      <header className="space-y-1">
        <h1 className="font-display-lg text-primary text-2xl leading-none">{t('Agri-Market')}</h1>
        <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t('Premium wholesale supplies')}</p>
      </header>

      {/* Success Notification */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-secondary/15 border border-secondary/30 text-secondary text-xs font-bold flex items-center gap-2"
          >
            <Check size={16} />
            {t(successMessage)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search & Notification Bell */}
      <section className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 bg-surface-container/30 border border-outline-variant/10 px-4 py-3 rounded-2xl flex items-center gap-3 focus-within:bg-white focus-within:shadow-md transition-all">
            <Search size={18} className="text-primary/40 focus-within:text-primary transition-colors" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none focus:outline-none w-full font-bold text-sm text-primary placeholder:text-primary/30" 
              placeholder={t('Seeds, tools, fertilizers...')} 
              type="text"
            />
          </div>
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="bg-primary/5 text-primary p-3.5 rounded-2xl border border-primary/10 hover:bg-primary hover:text-white transition-all relative flex items-center justify-center active:scale-95"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-error text-white rounded-full text-[9px] font-black flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* Categories Scroller */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar -mx-2 px-2">
          {["All", "Seeds", "Fertilizer", "Tools", "Chemicals"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' 
                  : 'bg-white border border-surface-container text-on-surface-variant'
              }`}
            >
              {t(cat)}
            </button>
          ))}
        </div>
      </section>

      {/* Main Marketplace Feed */}
      <section className="space-y-4">
        <div className="flex justify-between items-end">
          <h2 className="font-display-lg text-primary text-base">{t('Agri-Market Listings')}</h2>
          <span className="text-on-surface-variant/40 text-[9px] font-black uppercase tracking-widest">{filteredProducts.length} {t('Results Found')}</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="glass-card p-10 rounded-[32px] border border-surface-container/50 bg-white/40 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
              <Package size={32} />
            </div>
            <h3 className="font-bold text-primary text-sm">{t('No items in the market')}</h3>
            <p className="text-xs text-on-surface-variant/70 mt-1 max-w-[220px]">
              No seller products match your filter. Check back later when sellers post supplies!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
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
                <div key={product.id} className="glass-card rounded-[28px] overflow-hidden group border border-surface-container/50 bg-white/60 flex flex-col justify-between p-4 gap-3 shadow-sm w-full min-w-0 box-border">
                  <div className="flex gap-3 w-full min-w-0">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-container shrink-0 border border-white/50">
                      {product.imageUrl ? (
                        <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-primary">
                          <Package size={28} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-primary text-base line-clamp-1">{product.name}</h4>
                        <div className="flex items-center gap-0.5 bg-secondary/15 px-2 py-0.5 rounded-full shrink-0">
                          <Star size={10} className="text-secondary fill-secondary" />
                          <span className="text-[9px] font-black text-secondary">4.8</span>
                        </div>
                      </div>
                      <p className="text-on-surface-variant/60 text-[10px] font-bold uppercase mt-0.5">{t('By')} {product.seller?.companyName || product.seller?.fullName || 'Premium Seller'}</p>
                      <p className="text-[11px] text-on-surface-variant/80 mt-1 line-clamp-2 leading-relaxed">{displayDesc || 'High quality seeds, fertilizers, and supplies for professional growers.'}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-surface-container/30 flex items-center justify-between w-full min-w-0 gap-2">
                    <div className="flex flex-col shrink-0">
                      <span className="text-[8px] text-on-surface-variant/40 font-black uppercase tracking-widest">{t('Price')}</span>
                      <span className="text-primary font-black text-sm">${product.price} <span className="text-on-surface-variant/40 font-bold text-[9px]">/ unit</span></span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 min-w-0">
                      {displayLoc && displayLoc !== 'N/A' && (
                        <div className="flex items-center text-[9px] text-on-surface-variant/60 gap-0.5 font-bold shrink-0">
                          <Landmark size={11} className="text-primary/40" />
                          <span className="truncate max-w-[55px]">{displayLoc}</span>
                        </div>
                      )}
                      
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        disabled={product.stock === 0}
                        className={`px-3 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-1 font-black text-[9px] uppercase tracking-wider shrink-0 whitespace-nowrap ${
                          product.stock === 0
                            ? 'bg-surface-container text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/10 shadow-none'
                            : 'bg-primary text-on-primary shadow-primary/20 hover:scale-105'
                        }`}
                      >
                        <ShoppingCart size={12} />
                        {product.stock === 0 ? t('Out of stock') : t('Buy Now')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Slide-over Notifications Center */}
      <AnimatePresence>
        {isNotifOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNotifOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />

            {/* Notification Drawer Content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[340px] bg-white h-screen shadow-2xl p-6 border-l border-outline-variant/10 flex flex-col"
            >
              <div className="flex justify-between items-center pb-4 border-b border-surface-container/30 mb-4">
                <div>
                  <h3 className="font-display-lg text-primary text-lg font-black">{t('Alert Hub')}</h3>
                  <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{t('Market Status Alerts')}</p>
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="bg-surface-container/50 text-primary p-2 rounded-full active:scale-90 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-6">
                {farmerOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell size={32} className="text-primary/20 mx-auto mb-2" />
                    <p className="text-xs text-on-surface-variant/60">No new status updates.</p>
                  </div>
                ) : (
                  [...farmerOrders].reverse().map((order) => {
                    const isApproved = order.status === 'APPROVED';
                    const isRejected = order.status === 'REJECTED';
                    
                    return (
                      <div 
                        key={order.id} 
                        className={`p-4 rounded-3xl border text-xs relative overflow-hidden transition-all ${
                          isApproved ? 'bg-secondary/5 border-secondary/20 text-primary' :
                          isRejected ? 'bg-error/5 border-error/20 text-primary' : 'bg-surface-container/20 border-surface-container/40 text-on-surface-variant'
                        }`}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <p className="font-bold">
                              {isApproved ? t('Order Approved!') : isRejected ? t('Request Rejected') : t('Order Pending')}
                            </p>
                            <p className="text-[10px] text-on-surface-variant/75 mt-0.5">
                              Your order for <strong>{order.sellerProduct?.name || 'Supply item'}</strong> ({order.quantity} units) has been {order.status.toLowerCase()}.
                            </p>
                          </div>
                        </div>

                        {isApproved && order.sellerProduct?.seller && (
                          <div className="mt-3 p-3 bg-white rounded-2xl border border-secondary/15 space-y-1 text-[11px] shadow-sm">
                            <p className="font-black text-secondary uppercase text-[8px] tracking-widest mb-1">{t('Seller Contact info')}</p>
                            <p className="font-bold text-primary">{order.sellerProduct.seller.companyName || order.sellerProduct.seller.fullName}</p>
                            {order.sellerProduct.seller.phone && (
                              <p className="flex items-center gap-1.5 text-[10px] text-on-surface-variant/80 mt-1">
                                <Phone size={10} className="text-secondary shrink-0" />
                                <span>{order.sellerProduct.seller.phone}</span>
                              </p>
                            )}
                            {order.sellerProduct.seller.address && (
                              <p className="flex items-start gap-1.5 text-[10px] text-on-surface-variant/80 mt-1">
                                <MapPin size={10} className="text-secondary mt-0.5 shrink-0" />
                                <span className="leading-tight">{order.sellerProduct.seller.address}</span>
                              </p>
                            )}
                          </div>
                        )}

                        <div className="mt-2.5 flex items-center gap-1 text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-wider">
                          <Clock size={10} />
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Buy Quantity Modal confirmation */}
      {selectedProduct && (
        <BuyQuantityModal 
          open={!!selectedProduct}
          onClose={() => setSelectedProduct(null)}
          product={selectedProduct}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
};

export default Supplies;
