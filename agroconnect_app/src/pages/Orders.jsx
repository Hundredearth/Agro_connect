import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { ListOrdered, CheckCircle2, Clock, MapPin, Phone, Landmark, XCircle, AlertCircle, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const Orders = () => {
  const { role, profile, t } = useRole();
  const [customerOrders, setCustomerOrders] = useState([]);
  const [dbSellerOrders, setDbSellerOrders] = useState([]);
  const [dbFarmerOrders, setDbFarmerOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomerOrders = async () => {
    if (!profile?.id) return;
    try {
      const res = await axios.get(`/api/orders/customer/${profile.id}`);
      setCustomerOrders(res.data);
    } catch (e) {
      console.error('Failed to fetch customer orders', e);
    }
  };

  const fetchSellerOrders = async () => {
    if (!profile?.id) return;
    try {
      const res = await axios.get(`/api/seller-orders/seller/${profile.id}`);
      setDbSellerOrders(res.data);
    } catch (e) {
      console.error('Failed to fetch seller orders', e);
    }
  };

  const fetchFarmerOrders = async () => {
    if (!profile?.id) return;
    try {
      const res = await axios.get(`/api/seller-orders/farmer/${profile.id}`);
      setDbFarmerOrders(res.data);
    } catch (e) {
      console.error('Failed to fetch farmer orders', e);
    }
  };

  const loadData = async () => {
    setLoading(true);
    if (!profile?.id) {
      setLoading(false);
      return;
    }
    if (role === 'customer') {
      await fetchCustomerOrders();
    } else if (role === 'seller') {
      await fetchSellerOrders();
    } else if (role === 'farmer') {
      await fetchFarmerOrders();
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [role, profile]);

  const handleSellerStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/seller-orders/${orderId}/status`, { status: newStatus });
      fetchSellerOrders();
    } catch (e) {
      console.error('Failed to update seller order status', e);
      alert('Failed to update order status.');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-black uppercase tracking-widest text-primary/60">{t("Loading orders...")}</p>
      </div>
    );
  }

  // CUSTOMER VIEW - Orders made to farmers for fresh produce
  if (role === 'customer') {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-4 space-y-6 pb-36">
        <header className="space-y-1">
          <h1 className="font-display-lg text-primary text-2xl leading-none">{t("My Purchases")}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t("Pickup approved orders")}</p>
        </header>

        <section className="space-y-4">
          {customerOrders.length === 0 ? (
            <div className="glass-card p-10 rounded-[32px] border border-surface-container/50 bg-white/40 text-center flex flex-col items-center justify-center">
              <ListOrdered size={36} className="text-primary mb-3" />
              <h3 className="font-bold text-primary text-sm">{t("No active orders")}</h3>
              <p className="text-xs text-on-surface-variant/75 mt-1 max-w-[240px]">
                {t("Approved crop requests will show here with farmers pickup address.")}
              </p>
            </div>
          ) : (
            customerOrders.map(order => (
              <div key={order.id} className="glass-card overflow-hidden rounded-[32px] border-l-8 border-secondary shadow-sm bg-white/60 p-5 space-y-4 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-primary text-base">{order.produce?.name}</h3>
                    <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mt-0.5">
                      {t("Quantity:")} {order.quantity} • {t("Status:")} <span className="text-secondary font-black">{t(order.status)}</span>
                    </p>
                  </div>
                  <span className="px-3 py-1.5 bg-secondary/15 text-secondary rounded-full text-[9px] font-black uppercase tracking-widest">
                    {t("Approved")}
                  </span>
                </div>

                <div className="bg-surface-container/20 p-4 rounded-2xl space-y-2 border border-white/50">
                  <p className="text-[9px] text-primary/50 font-black uppercase tracking-widest">{t("Farmer Contact")}</p>
                  <p className="text-xs font-black text-primary">{order.produce?.farmer?.fullName || t('Harvest Farmer')}</p>
                  {order.produce?.farmer?.phone && (
                    <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80 mt-1">
                      <Phone size={12} className="text-secondary" />
                      <span>{order.produce.farmer.phone}</span>
                    </div>
                  )}
                  {order.produce?.farmer?.address && (
                    <div className="flex items-start gap-1.5 text-xs text-on-surface-variant/80 mt-1">
                      <MapPin size={12} className="text-secondary shrink-0 mt-0.5" />
                      <span className="leading-tight">{order.produce.farmer.address}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </section>
      </div>
    );
  }

  // SELLER VIEW - Wholesale orders placed by Farmers for agricultural input stock
  if (role === 'seller') {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-4 space-y-6 pb-36">
        <header className="space-y-1">
          <h1 className="font-display-lg text-primary text-2xl leading-none">{t("Agri-Market Orders")}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t("Incoming wholesaler demands")}</p>
        </header>

        <section className="space-y-5">
          {dbSellerOrders.length === 0 ? (
            <div className="glass-card p-10 rounded-[32px] border border-surface-container/50 bg-white/40 text-center flex flex-col items-center justify-center">
              <ListOrdered size={36} className="text-primary mb-3" />
              <h3 className="font-bold text-primary text-sm">{t("No incoming orders")}</h3>
              <p className="text-xs text-on-surface-variant/75 mt-1 max-w-[240px]">
                {t("Orders placed by farmers for your listed stock will appear here.")}
              </p>
            </div>
          ) : (
            dbSellerOrders.map(order => {
              const isPending = order.status === 'PENDING';
              const isApproved = order.status === 'APPROVED';
              const isRejected = order.status === 'REJECTED';

              return (
                <div 
                  key={order.id} 
                  className={`glass-card overflow-hidden rounded-[32px] border shadow-md bg-white/70 relative transition-all duration-300 hover:shadow-lg ${
                    isPending ? 'border-primary/20' : 
                    isApproved ? 'border-secondary/25' : 'border-error/20'
                  }`}
                >
                  {/* Status radial background soft glow */}
                  <div className={`absolute top-[-20%] right-[-10%] w-[35%] aspect-square rounded-full blur-[50px] pointer-events-none opacity-20 ${
                    isPending ? 'bg-primary' : 
                    isApproved ? 'bg-secondary' : 'bg-error'
                  }`}></div>

                  <div className="p-5 space-y-4 relative z-10">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-primary text-base leading-snug">
                          {order.farmer?.fullName || t('Farmer Grower')}
                        </h3>
                        <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-widest mt-1">
                          {t("Order:")} #{order.id.slice(0, 8).toUpperCase()}
                        </p>
                      </div>
                      <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                        isPending ? 'bg-primary/10 text-primary' : 
                        isApproved ? 'bg-secondary/15 text-secondary' : 'bg-error/10 text-error'
                      }`}>
                        {t(order.status)}
                      </span>
                    </div>

                    {/* Order Item Details Panel */}
                    <div className="bg-gradient-to-br from-surface-container/30 to-surface-container-high/10 p-4 rounded-2xl border border-outline-variant/10 flex justify-between items-center">
                      <div>
                        <p className="text-[9px] text-on-surface-variant/50 font-black uppercase tracking-wider">{t("Item Details")}</p>
                        <p className="text-xs font-black text-primary mt-1">{order.sellerProduct?.name || t('Supply item')}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[9px] text-on-surface-variant/50 font-black uppercase tracking-wider">{t("Quantity")}</p>
                        <p className="text-xs font-black text-secondary mt-1 bg-secondary/10 px-3 py-1 rounded-lg w-fit ml-auto">
                          {order.quantity} {t("units")}
                        </p>
                      </div>
                    </div>

                    {/* Farmer Contact & Address details */}
                    <div className="space-y-2 border-t border-surface-container/40 pt-3 text-xs text-primary/95 font-medium">
                      <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-widest mb-1.5">{t("Farmer Pickup Details")}</p>
                      {order.farmer?.phone && (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                            <Phone size={11} className="text-secondary" />
                          </div>
                          <span className="text-on-surface-variant/80"><strong>{t("Phone:")}</strong> {order.farmer.phone}</span>
                        </div>
                      )}
                      {order.farmer?.address && (
                        <div className="flex items-start gap-2">
                          <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <MapPin size={11} className="text-secondary" />
                          </div>
                          <span className="text-on-surface-variant/80 leading-relaxed"><strong>{t("Address:")}</strong> {order.farmer.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Footer */}
                  {isPending && (
                    <div className="bg-surface-container/20 p-4 flex gap-3 border-t border-surface-container/30 relative z-10">
                      <button 
                        onClick={() => handleSellerStatusUpdate(order.id, 'APPROVED')}
                        className="flex-1 py-3.5 bg-primary text-on-primary rounded-2xl font-black text-[10px] uppercase tracking-widest shadow hover:scale-[1.01] active:scale-95 transition-all"
                      >
                        {t("Approve Demand")}
                      </button>
                      <button 
                        onClick={() => handleSellerStatusUpdate(order.id, 'REJECTED')}
                        className="px-5 py-3.5 border border-outline-variant/30 rounded-2xl font-black text-[10px] uppercase tracking-widest text-on-surface-variant hover:bg-error/5 hover:text-error transition-all"
                      >
                        {t("Reject")}
                      </button>
                    </div>
                  )}

                  {isApproved && (
                    <div className="bg-secondary/5 p-4 flex items-center justify-center gap-2 text-secondary text-[10px] font-black uppercase tracking-widest border-t border-secondary/10 relative z-10">
                      <CheckCircle2 size={15} />
                      {t("Demand Approved & Released")}
                    </div>
                  )}
                  
                  {isRejected && (
                    <div className="bg-error/5 p-4 flex items-center justify-center gap-2 text-error text-[10px] font-black uppercase tracking-widest border-t border-error/10 relative z-10">
                      <XCircle size={15} />
                      {t("Demand Rejected")}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>
      </div>
    );
  }

  // FARMER VIEW - Wholesale supplies farmer bought from sellers
  if (role === 'farmer') {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-4 space-y-6 pb-36">
        <header className="space-y-1">
          <h1 className="font-display-lg text-primary text-2xl leading-none">{t("Wholesale Supplies")}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t("Track purchases from marketplace")}</p>
        </header>

        <section className="space-y-4">
          {dbFarmerOrders.length === 0 ? (
            <div className="glass-card p-10 rounded-[32px] border border-surface-container/50 bg-white/40 text-center flex flex-col items-center justify-center">
              <ShoppingBag size={36} className="text-primary mb-3" />
              <h3 className="font-bold text-primary text-sm">{t("No wholesale orders")}</h3>
              <p className="text-xs text-on-surface-variant/75 mt-1 max-w-[240px]">
                {t("When you buy wholesale seeds or tools, the orders will track here.")}
              </p>
            </div>
          ) : (
            dbFarmerOrders.map(order => (
              <div key={order.id} className={`glass-card overflow-hidden rounded-[32px] border-l-8 shadow-sm bg-white/60 p-5 space-y-4 ${
                order.status === 'PENDING' ? 'border-primary' : order.status === 'APPROVED' ? 'border-secondary' : 'border-error/40'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-primary text-base">{order.sellerProduct?.name || t('Supply Product')}</h3>
                    <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mt-0.5">
                      {t("Quantity:")} {order.quantity} • {t("Cost:")} ${((order.sellerProduct?.price || 0) * order.quantity).toFixed(2)}
                    </p>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    order.status === 'PENDING' ? 'bg-primary/10 text-primary' : 
                    order.status === 'APPROVED' ? 'bg-secondary/15 text-secondary animate-bounce' : 'bg-error/10 text-error'
                  }`}>
                    {t(order.status)}
                  </span>
                </div>

                {order.status === 'APPROVED' && (
                  <div className="bg-secondary/5 p-4 rounded-2xl space-y-2 border border-secondary/20">
                    <div className="flex items-center gap-1.5 text-secondary text-[10px] font-black uppercase tracking-widest mb-1">
                      <AlertCircle size={14} />
                      {t("Seller Contact Approved!")}
                    </div>
                    <p className="text-xs font-black text-primary">{order.sellerProduct?.seller?.companyName || order.sellerProduct?.seller?.fullName || t('Seller')}</p>
                    {order.sellerProduct?.seller?.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/80 mt-1">
                        <Phone size={12} className="text-secondary" />
                        <span><strong>{t("Phone:")}</strong> {order.sellerProduct.seller.phone}</span>
                      </div>
                    )}
                    {order.sellerProduct?.seller?.address && (
                      <div className="flex items-start gap-1.5 text-xs text-on-surface-variant/80 mt-1">
                        <MapPin size={12} className="text-secondary shrink-0 mt-0.5" />
                        <span className="leading-tight"><strong>{t("Address:")}</strong> {order.sellerProduct.seller.address}</span>
                      </div>
                    )}
                  </div>
                )}

                {order.status === 'PENDING' && (
                  <div className="bg-surface-container/20 p-4 rounded-2xl border border-white/50 text-[11px] text-on-surface-variant/80 flex items-center gap-2">
                    <Clock size={14} className="text-primary/50 animate-spin" />
                    <span>{t("Waiting for seller to approve and release contact details.")}</span>
                  </div>
                )}

                {order.status === 'REJECTED' && (
                  <div className="bg-error/5 p-4 rounded-2xl border border-error/25 text-[11px] text-error flex items-center gap-2">
                    <XCircle size={14} />
                    <span>{t("Seller rejected this supply request. Please search other listings.")}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
      <ListOrdered size={64} className="text-outline-variant mb-4" />
      <h2 className="font-display-lg text-primary text-2xl font-black">{t("Access Denied")}</h2>
      <p className="text-on-surface-variant text-sm mt-1 max-w-[280px]">{t("Please switch to a Customer, Farmer, or Seller role to track orders.")}</p>
    </div>
  );
};

export default Orders;
