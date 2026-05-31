import React, { useState } from 'react';
import { X, Check, Shield, MapPin, Phone, User, Sprout, Landmark } from 'lucide-react';
import axios from 'axios';
import { useRole } from '../context/RoleContext';

// Props: open (bool), onClose (func), targetRole (string), user (object), onComplete (func)
const ProfileCompletionModal = ({ open, onClose, targetRole, user, onComplete }) => {
  const { t } = useRole();
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address: '',
    farmSize: '',
    companyName: ''
  });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        email: user.email,
        password: user.password,
        role: targetRole,
        fullName: form.fullName,
        phone: form.phone,
        address: form.address,
        farmSize: targetRole === 'farmer' ? form.farmSize : undefined,
        companyName: targetRole === 'seller' ? form.companyName : undefined
      };
      
      const res = await axios.post('/api/auth/register', payload);
      onComplete(res.data);
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || t('Server error'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="glass-card w-full max-w-sm p-6 rounded-[32px] bg-white border border-white/50 shadow-2xl space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h3 className="font-display-lg text-primary text-xl leading-none capitalize">{t('Complete Profile')}</h3>
            <p className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">
              {t('Enter details to active role')}: {t(targetRole)}
            </p>
          </div>
          <button onClick={onClose} className="text-error hover:bg-error/5 p-1 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        {error && <p className="text-error text-xs text-center font-bold">{t(error)}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-outline-variant/30 py-2">
            <User size={18} className="text-on-surface-variant mr-2" />
            <input
              type="text"
              name="fullName"
              required
              placeholder={t('Full Name')}
              value={form.fullName}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-primary text-sm placeholder:text-on-surface-variant/60 font-bold"
            />
          </div>

          <div className="flex items-center border-b border-outline-variant/30 py-2">
            <Phone size={18} className="text-on-surface-variant mr-2" />
            <input
              type="text"
              name="phone"
              required
              placeholder={t('Phone Number')}
              value={form.phone}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-primary text-sm placeholder:text-on-surface-variant/60 font-bold"
            />
          </div>

          <div className="flex items-center border-b border-outline-variant/30 py-2">
            <MapPin size={18} className="text-on-surface-variant mr-2" />
            <input
              type="text"
              name="address"
              required
              placeholder={t('Address')}
              value={form.address}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-primary text-sm placeholder:text-on-surface-variant/60 font-bold"
            />
          </div>

          {targetRole === 'farmer' && (
            <div className="flex items-center border-b border-outline-variant/30 py-2">
              <Sprout size={18} className="text-on-surface-variant mr-2" />
              <input
                type="text"
                name="farmSize"
                placeholder={t('Farm Size (Acres)')}
                value={form.farmSize}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-primary text-sm placeholder:text-on-surface-variant/60 font-bold"
              />
            </div>
          )}

          {targetRole === 'seller' && (
            <div className="flex items-center border-b border-outline-variant/30 py-2">
              <Landmark size={18} className="text-on-surface-variant mr-2" />
              <input
                type="text"
                name="companyName"
                placeholder={t('Company Name')}
                value={form.companyName}
                onChange={handleChange}
                className="flex-1 bg-transparent outline-none text-primary text-sm placeholder:text-on-surface-variant/60 font-bold"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            <Check size={16} /> {submitting ? t('Submitting...') : t('Save & Activate')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCompletionModal;
