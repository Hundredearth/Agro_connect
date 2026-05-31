import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';
import { ChevronRight, Sprout, ShoppingCart, LayoutDashboard, UserCircle } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const { setRole, t } = useRole();

  const selectRole = (role) => {
    setRole(role);
    if (role === 'customer') {
      navigate('/home');
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-surface-dim flex justify-center items-center overflow-hidden font-body-base antialiased p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <img 
          className="absolute inset-0 w-full h-full object-cover opacity-20 scale-110 blur-sm" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLZPNy0DCcPdk5jSY0ktQq8uh9oTRGJUG05I8zXTbMyBJ4-BsNLqYwK6Nr0hpdt1eVnzQkrhGY_8sbAJ8tsHm1YWkyfhzzoE4eTBzanslMPSkNUWDJN1rv9hyq7bhK3dBCEwRoRP_MbEwUEvfzvbit-A0DIIQleILzKrOb-Mcf_b-__ICAyjk2CxAcTV8hp3mDEtKduUKV94ahcQzHEAd6sTqAqv7oUnIQJ1uQxL4LWAuJnlzc-jnBrSTegUpBthNhAytlsbHXOWgU" 
          alt="Sustainability"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-surface-dim"></div>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center text-center space-y-12">
        <header className="space-y-3">
          <div className="w-20 h-20 bg-primary rounded-[32px] mx-auto flex items-center justify-center text-white shadow-2xl shadow-primary/20 rotate-3">
            <Sprout size={40} />
          </div>
          <div className="space-y-1">
            <h1 className="font-display-lg text-primary text-4xl tracking-tight leading-tight">AgroConnect</h1>
            <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t("The Future of Agriculture")}</p>
          </div>
        </header>

        <div className="w-full space-y-4">
          <button 
            onClick={() => selectRole('farmer')}
            className="w-full glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 hover:bg-white transition-all active:scale-95 text-left group"
          >
            <div className="w-14 h-14 bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center group-hover:bg-secondary group-hover:text-white transition-all shadow-lg shadow-secondary/5">
              <Sprout size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary text-base">{t("Farmer Portal")}</h3>
              <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Insights, markets & tools")}</p>
            </div>
            <ChevronRight size={20} className="text-on-surface-variant/20" />
          </button>

          <button 
            onClick={() => selectRole('customer')}
            className="w-full glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 hover:bg-white transition-all active:scale-95 text-left group"
          >
            <div className="w-14 h-14 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/5">
              <ShoppingCart size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary text-base">{t("Shop Fresh")}</h3>
              <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Direct from local farms")}</p>
            </div>
            <ChevronRight size={20} className="text-on-surface-variant/20" />
          </button>

          <button 
            onClick={() => selectRole('seller')}
            className="w-full glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 hover:bg-white transition-all active:scale-95 text-left group"
          >
            <div className="w-14 h-14 bg-tertiary/10 text-tertiary rounded-2xl flex items-center justify-center group-hover:bg-tertiary group-hover:text-white transition-all shadow-lg shadow-tertiary/5">
              <LayoutDashboard size={28} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-primary text-base">{t("Seller Hub")}</h3>
              <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Manage stock & orders")}</p>
            </div>
            <ChevronRight size={20} className="text-on-surface-variant/20" />
          </button>
        </div>

        <button 
          onClick={() => selectRole('farmer')}
          className="w-full bg-primary text-on-primary py-5 rounded-[28px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
        >
          {t("Quick Start")}
        </button>
      </div>
    </div>
  );
};

export default Welcome;
