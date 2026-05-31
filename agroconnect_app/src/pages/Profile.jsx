import React, { useState, useEffect } from 'react';
import { useRole } from '../context/RoleContext';
import { LogOut, User, MapPin, Package, Save, Plus, Trash2, ChevronRight, Settings, Shield, ShoppingCart, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Profile = () => {
  const { role, profile, user, logout, language, setLanguage, t, setProfile } = useRole();
  const navigate = useNavigate();
  const [farmerInventory, setFarmerInventory] = useState([]);
  
  // Settings Drawer & Form states
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    farmSize: '',
    companyName: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  const [newItem, setNewItem] = useState({ name: '', quantity: '', unit: 'kg', price: '', location: '' });

  useEffect(() => {
    if (profile) {
      setProfileForm({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || '',
        farmSize: profile.farmSize || '',
        companyName: profile.companyName || ''
      });
    }
  }, [profile]);

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  // Fetch farmer inventory on load
  useEffect(() => {
    if (role === 'farmer' && profile?.id) {
      fetch(`/api/produce/farmer/${profile.id}`)
        .then(res => res.json())
        .then(data => setFarmerInventory(data))
        .catch(err => console.error('Failed to load inventory', err));
    }
  }, [role, profile]);

  const removeInventoryItem = async (id) => {
    try {
      await fetch(`/api/produce/${id}`, { method: 'DELETE' });
      setFarmerInventory(farmerInventory.filter(item => item.id !== id));
    } catch (err) {
      console.error('Delete inventory error', err);
    }
  };

  const addInventoryItem = async () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      alert(t('Item Name') + ', ' + t('Quantity (kg)') + ', and ' + t('Price ($ / kg)') + ' are required.');
      return;
    }
    try {
      const res = await fetch(`/api/produce`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerId: profile.id,
          name: newItem.name,
          description: newItem.location || 'Local Area',
          price: parseFloat(newItem.price),
          stock: parseInt(newItem.quantity, 10),
          imageUrl: ''
        })
      });
      if (res.ok) {
        const added = await res.json();
        setFarmerInventory([...farmerInventory, added]);
        setNewItem({ name: '', quantity: '', unit: 'kg', price: '', location: '' });
      } else {
        alert('Failed to add item to inventory');
      }
    } catch (err) {
      console.error('Add inventory error', err);
      alert('Failed to add item to inventory');
    }
  };

  const handleSaveSettings = async () => {
    if (!profileForm.fullName) {
      alert(t('Full Name') + ' is required.');
      return;
    }
    setSaveLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}/profile/${role}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profileForm.fullName,
          phone: profileForm.phone,
          address: profileForm.address,
          farmSize: role === 'farmer' ? profileForm.farmSize : undefined,
          companyName: role === 'seller' ? profileForm.companyName : undefined
        })
      });
      if (res.ok) {
        const updatedProfile = await res.json();
        setProfile(updatedProfile);
        
        // Update local session
        const auth = JSON.parse(localStorage.getItem('auth') || '{}');
        auth.profile = updatedProfile;
        localStorage.setItem('auth', JSON.stringify(auth));
        
        setIsSettingsOpen(false);
      } else {
        alert('Failed to save settings');
      }
    } catch (e) {
      console.error(e);
      alert('Error saving settings');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 pt-2 space-y-8 pb-32">
      {/* Header */}
      <section className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="font-display-lg text-primary text-2xl capitalize leading-none">{t(role)} {t('Profile')}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t('Account Settings')}</p>
        </div>
        <button 
          onClick={handleSignOut}
          className="bg-error/5 text-error px-4 py-2 rounded-2xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest hover:bg-error hover:text-white transition-all shadow-sm active:scale-95"
        >
          <LogOut size={14} />
          {t('Sign Out')}
        </button>
      </section>

      {/* User Info Card */}
      <section className="relative glass-card p-6 rounded-[32px] overflow-hidden border border-surface-container/50 bg-white/60 shadow-sm">
        <div className="absolute top-0 right-0 p-6">
          <Settings 
            size={20} 
            onClick={() => setIsSettingsOpen(true)}
            className="text-primary/20 hover:text-primary hover:rotate-45 transition-all duration-300 cursor-pointer" 
          />
        </div>
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-xl shadow-primary/20 overflow-hidden font-black text-2xl">
              {profile?.fullName ? profile.fullName.charAt(0) : <User size={40} strokeWidth={1.5} />}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-secondary p-1.5 rounded-xl border-4 border-white text-on-secondary shadow-lg">
              <Shield size={12} />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="font-display-lg text-primary text-xl leading-tight">{profile?.fullName || 'Agro Member'}</h2>
            <p className="text-on-surface-variant/60 text-[11px] font-medium tracking-tight">{user?.email || 'member@agroconnect.com'}</p>
            <div className="flex gap-2 mt-2">
              <span className="px-2.5 py-1 bg-secondary/10 text-secondary rounded-lg text-[9px] font-black uppercase tracking-widest">{t('Verified')} {t(role)}</span>
              {profile?.phone && (
                <span className="px-2.5 py-1 bg-primary/5 text-primary rounded-lg text-[9px] font-black uppercase tracking-widest">{profile.phone}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Role Specific Content */}
      {role === 'farmer' && (
        <section className="space-y-6">
          <div className="flex justify-between items-end px-2">
            <div className="space-y-0.5">
              <h3 className="font-display-lg text-primary text-lg">{t('Produce Inventory')}</h3>
              <p className="text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">Global Marketplace Feed</p>
            </div>
            <span className="text-secondary font-black text-[10px] uppercase tracking-widest flex items-center gap-1 bg-secondary/5 px-2 py-1 rounded-lg">
              <Package size={12} /> Live
            </span>
          </div>
          
          <div className="space-y-3">
            {farmerInventory.length === 0 ? (
              <p className="text-center text-on-surface-variant/60 py-8 font-medium">No inventory listed yet.</p>
            ) : (
              farmerInventory.map(item => (
                <div key={item.id} className="glass-card p-4 rounded-2xl flex items-center justify-between border border-surface-container/30 bg-white/40 hover:bg-white transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-high/50 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all font-bold">
                      {item.name.charAt(0)}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-primary text-sm">{item.name}</h4>
                      <p className="text-[10px] text-on-surface-variant font-medium">
                        {item.stock} kg • <span className="font-black text-secondary">${item.price.toFixed(2)}/kg</span>
                      </p>
                      {item.description && (
                        <div className="flex items-center gap-1 text-[9px] text-on-surface-variant/40 font-bold uppercase tracking-widest">
                          <MapPin size={8} /> {item.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <button onClick={() => removeInventoryItem(item.id)} className="text-error/30 hover:text-error p-2 rounded-xl hover:bg-error/5 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="glass-card p-6 rounded-[32px] border-2 border-dashed border-surface-container-high bg-surface-container/10 space-y-4">
            <h4 className="font-black text-primary text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Plus size={14} /> {t('Add New Listing')}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Item Name')}</label>
                <input className="w-full bg-white border border-surface-container-high rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none" placeholder="e.g. Organic Tomato" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Quantity (kg)')}</label>
                <input className="w-full bg-white border border-surface-container-high rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none" placeholder="Qty" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Price ($ / kg)')}</label>
                <input className="w-full bg-white border border-surface-container-high rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none" placeholder="Price" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Location Details')}</label>
                <input className="w-full bg-white border border-surface-container-high rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 transition-all outline-none" placeholder="Plot B-14, North Gate" value={newItem.location} onChange={e => setNewItem({...newItem, location: e.target.value})} />
              </div>
            </div>
            <button onClick={addInventoryItem} className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-primary/20 mt-2">
              <Save size={16} /> {t('Update Inventory')}
            </button>
          </div>
        </section>
      )}

      {role === 'customer' && (
        <section className="space-y-4">
          <h3 className="font-display-lg text-primary text-lg px-2">{t('Account Details')}</h3>
          <div className="space-y-3">
            <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-surface-container/30 bg-white/40">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
                  <MapPin size={22} strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{t('Delivery Address')}</p>
                  <p className="font-bold text-primary text-sm">{profile?.address || 'No address specified'}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-on-surface-variant/30" />
            </div>
            <div className="glass-card p-4 rounded-2xl flex items-center justify-between border border-surface-container/30 bg-white/40">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                  <ShoppingCart size={22} strokeWidth={2} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest">{t('Payment Method')}</p>
                  <p className="font-bold text-primary text-sm">{t('Payment Method')}</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-on-surface-variant/30" />
            </div>
          </div>
        </section>
      )}

      {role === 'seller' && (
        <section className="space-y-4">
          <h3 className="font-display-lg text-primary text-lg px-2">{t('Performance Summary')}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-6 rounded-[32px] text-center border border-surface-container/30 bg-white/60 shadow-sm relative overflow-hidden group hover:bg-primary transition-all duration-500">
              <div className="relative z-10">
                <p className="text-3xl font-black text-primary group-hover:text-white transition-colors leading-none mb-1">124</p>
                <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">{t('Sales Volume')}</p>
              </div>
              <Package size={60} className="absolute -bottom-4 -right-4 text-primary/5 group-hover:text-white/10 transition-colors" />
            </div>
            <div className="glass-card p-6 rounded-[32px] text-center border border-surface-container/30 bg-white/60 shadow-sm relative overflow-hidden group hover:bg-secondary transition-all duration-500">
              <div className="relative z-10">
                <p className="text-3xl font-black text-secondary group-hover:text-white transition-colors leading-none mb-1">4.9</p>
                <p className="text-[9px] text-on-surface-variant font-black uppercase tracking-[0.2em] group-hover:text-white/60 transition-colors">{t('Avg Rating')}</p>
              </div>
              <Plus size={60} className="absolute -bottom-4 -right-4 text-secondary/5 group-hover:text-white/10 transition-colors" />
            </div>
          </div>
        </section>
      )}

      {/* Settings Overlay Drawer */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[200] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-[340px] bg-white h-screen shadow-2xl p-6 border-l border-outline-variant/10 flex flex-col z-10"
            >
              <div className="flex justify-between items-center pb-4 border-b border-surface-container/30 mb-4">
                <div>
                  <h3 className="font-display-lg text-primary text-lg font-black">{t('Edit Profile & Settings')}</h3>
                  <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{t('Account Settings')}</p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-surface-container/50 text-primary p-2 rounded-full active:scale-90 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-6">
                {/* Language selection block */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Language Settings')}</label>
                  <div className="flex gap-2">
                    <button 
                      type="button" 
                      onClick={() => setLanguage('en')}
                      className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        language === 'en' 
                          ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/10' 
                          : 'bg-white border-surface-container text-primary/60 hover:text-primary'
                      }`}
                    >
                      EN (English)
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setLanguage('ta')}
                      className={`flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                        language === 'ta' 
                          ? 'bg-primary border-primary text-on-primary shadow-lg shadow-primary/10' 
                          : 'bg-white border-surface-container text-primary/60 hover:text-primary'
                      }`}
                    >
                      தமிழ் (Tamil)
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Full Name')}</label>
                  <input 
                    type="text" 
                    value={profileForm.fullName} 
                    onChange={e => setProfileForm({ ...profileForm, fullName: e.target.value })} 
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Phone Number')}</label>
                  <input 
                    type="text" 
                    value={profileForm.phone} 
                    onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} 
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Address')}</label>
                  <input 
                    type="text" 
                    value={profileForm.address} 
                    onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} 
                    className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 outline-none"
                  />
                </div>

                {role === 'farmer' && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Farm Size (Acres)')}</label>
                    <input 
                      type="text" 
                      value={profileForm.farmSize} 
                      onChange={e => setProfileForm({ ...profileForm, farmSize: e.target.value })} 
                      className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 outline-none"
                    />
                  </div>
                )}

                {role === 'seller' && (
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-2">{t('Company Name')}</label>
                    <input 
                      type="text" 
                      value={profileForm.companyName} 
                      onChange={e => setProfileForm({ ...profileForm, companyName: e.target.value })} 
                      className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl p-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/10 outline-none"
                    />
                  </div>
                )}
              </div>

              <button 
                onClick={handleSaveSettings} 
                disabled={saveLoading}
                className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all shadow-xl shadow-primary/20 shrink-0"
              >
                {saveLoading ? t('Submitting...') : t('Save Changes')}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
