import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { User, Lock, Mail, Phone, MapPin, Home, Users, ShoppingCart } from 'lucide-react';

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, register, setRole, language, setLanguage, t } = useRole();
  const [mode, setMode] = useState('login'); // 'login' or 'signup'
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'farmer',
    fullName: '',
    phone: '',
    address: '',
    farmSize: '',
    companyName: ''
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (mode === 'login') {
        const { user, profile, role } = await login(form.email, form.password);
        setRole(role);
        if (role === 'seller') {
          navigate('/inventory');
        } else {
          navigate('/home');
        }
      } else {
        const payload = {
          email: form.email,
          password: form.password,
          role: form.role,
          fullName: form.fullName,
          phone: form.phone,
          address: form.address,
          farmSize: form.role === 'farmer' ? form.farmSize : undefined,
          companyName: form.role === 'seller' ? form.companyName : undefined
        };
        const { user, profile, role } = await register(payload);
        setRole(role);
        if (role === 'seller') {
          navigate('/inventory');
        } else {
          navigate('/home');
        }
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || t('Server error'));
    }
  };

  return (
    <div className="min-h-screen bg-surface-dim flex justify-center items-center p-4 font-body-base">
      <div className="glass-card w-full max-w-md p-6 rounded-[32px] shadow-2xl border border-white/50">
        
        {/* Language Selection Pill & Logo Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-1 bg-primary/5 p-1 rounded-full border border-primary/10 shrink-0">
            <button 
              type="button" 
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                language === 'en' ? 'bg-primary text-on-primary shadow-sm' : 'text-primary/60 hover:text-primary'
              }`}
            >
              EN
            </button>
            <button 
              type="button" 
              onClick={() => setLanguage('ta')}
              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider transition-all ${
                language === 'ta' ? 'bg-primary text-on-primary shadow-sm' : 'text-primary/60 hover:text-primary'
              }`}
            >
              தமிழ்
            </button>
          </div>
          <Home size={32} className="text-primary" />
          <div className="w-16"></div> {/* Spacer for perfect alignment */}
        </div>

        <h2 className="font-display-lg text-primary text-3xl text-center mb-4">
          {t('AgroConnect')} {mode === 'login' ? t('Sign In') : t('Sign Up')}
        </h2>
        {error && <p className="text-error text-center mb-2">{t(error)}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-outline-variant/30 py-2">
            <Mail size={20} className="text-on-surface-variant mr-2" />
            <input
              type="email"
              name="email"
              required
              placeholder={t('Email Address')}
              value={form.email}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-on-surface-variant/60 font-bold"
            />
          </div>
          <div className="flex items-center border-b border-outline-variant/30 py-2">
            <Lock size={20} className="text-on-surface-variant mr-2" />
            <input
              type="password"
              name="password"
              required
              placeholder={t('Password')}
              value={form.password}
              onChange={handleChange}
              className="flex-1 bg-transparent outline-none text-primary placeholder:text-on-surface-variant/60 font-bold"
            />
          </div>
          {mode === 'signup' && (
            <>
              <div className="flex items-center border-b border-outline-variant/30 py-2">
                <User size={20} className="text-on-surface-variant mr-2" />
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder={t('Full Name')}
                  value={form.fullName}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-primary placeholder:text-on-surface-variant/60 font-bold"
                />
              </div>
              <div className="flex items-center border-b border-outline-variant/30 py-2">
                <Phone size={20} className="text-on-surface-variant mr-2" />
                <input
                  type="text"
                  name="phone"
                  required
                  placeholder={t('Phone Number')}
                  value={form.phone}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-primary placeholder:text-on-surface-variant/60 font-bold"
                />
              </div>
              <div className="flex items-center border-b border-outline-variant/30 py-2">
                <MapPin size={20} className="text-on-surface-variant mr-2" />
                <input
                  type="text"
                  name="address"
                  required
                  placeholder={t('Address')}
                  value={form.address}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-primary placeholder:text-on-surface-variant/60 font-bold"
                />
              </div>
              <div className="flex items-center border-b border-outline-variant/30 py-2">
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="flex-1 bg-transparent outline-none text-primary font-bold text-sm"
                >
                  <option value="farmer">{t('Farmer')}</option>
                  <option value="seller">{t('Seller')}</option>
                  <option value="customer">{t('Customer')}</option>
                </select>
              </div>
              {form.role === 'farmer' && (
                <div className="flex items-center border-b border-outline-variant/30 py-2">
                  <input
                    type="text"
                    name="farmSize"
                    placeholder={t('Farm Size (Acres)')}
                    value={form.farmSize}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-primary placeholder:text-on-surface-variant/60 font-bold"
                  />
                </div>
              )}
              {form.role === 'seller' && (
                <div className="flex items-center border-b border-outline-variant/30 py-2">
                  <input
                    type="text"
                    name="companyName"
                    placeholder={t('Company Name')}
                    value={form.companyName}
                    onChange={handleChange}
                    className="flex-1 bg-transparent outline-none text-primary placeholder:text-on-surface-variant/60 font-bold"
                  />
                </div>
              )}
            </>
          )}
          <button
            type="submit"
            className="w-full bg-primary text-on-primary py-3 rounded-[28px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all text-xs"
          >
            {mode === 'login' ? t('Sign In') : t('Sign Up')}
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          {mode === 'login' ? (
            <p className="text-on-surface-variant/80 font-medium">
              {t("Don't have an account?")}{' '}
              <span
                className="text-primary cursor-pointer font-black hover:underline"
                onClick={() => setMode('signup')}
              >
                {t('Sign Up')}
              </span>
            </p>
          ) : (
            <p className="text-on-surface-variant/80 font-medium">
              {t('Already have an account?')}{' '}
              <span
                className="text-primary cursor-pointer font-black hover:underline"
                onClick={() => setMode('login')}
              >
                {t('Sign In')}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
