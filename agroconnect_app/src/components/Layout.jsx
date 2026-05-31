import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BottomNav from './BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../context/RoleContext';
import ProfileCompletionModal from './ProfileCompletionModal';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, setRole, user, switchRole, register, t } = useRole();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingRole, setPendingRole] = useState(null);
  
  const hideNav = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#f8faf9] flex justify-center items-center overflow-hidden font-body-base antialiased">
      {/* Background decoration (Fixed) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] aspect-square bg-primary/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-secondary/5 rounded-full blur-[100px]"></div>
      </div>

      {/* Centered Mobile Container */}
      <div className="w-full max-w-[430px] h-screen bg-white relative shadow-[0_40px_100px_-20px_rgba(1,45,29,0.15)] overflow-hidden border-x border-outline-variant/10 flex flex-col sm:rounded-[40px] sm:h-[90vh] sm:my-8 border-4 border-white">
        
        {/* Status Bar Simulation (Mobile only feel) */}
        <div className="h-10 px-8 flex justify-between items-center text-[11px] font-bold text-primary/40 z-[60] bg-white/50 backdrop-blur-sm">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
            <span className="material-symbols-outlined text-[14px]">wifi</span>
            <span className="material-symbols-outlined text-[14px]">battery_full</span>
          </div>
        </div>

        {/* Top Bar with Role Switcher */}
        {!hideNav && (
          <header className="sticky top-0 z-50 px-6 py-4 flex justify-between items-center w-full bg-white/80 backdrop-blur-xl border-b border-surface-container">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-fixed flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[20px]">agriculture</span>
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-display-lg text-primary text-[14px] tracking-tight uppercase font-black">{t('AgroConnect')}</span>
                <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-widest">{t(role)} {t('Portal')}</span>
              </div>
            </div>
            
            <div className="relative group">
                <select 
                  value={role || ''} 
                  onChange={async (e) => {
                    const newRole = e.target.value;
                    try {
                      if (!user?.id) {
                        console.error('No logged in user found');
                        return;
                      }
                      const data = await switchRole(user.id, newRole);
                      if (data.profileExists) {
                        if (newRole === 'seller') {
                          navigate('/inventory');
                        } else {
                          navigate('/home');
                        }
                      } else {
                        setPendingRole(newRole);
                        setIsModalOpen(true);
                      }
                    } catch (err) {
                      console.error('Role switch error', err);
                    }
                  }}
                  className="bg-surface-container-low border border-outline-variant/20 rounded-full text-[10px] font-black uppercase py-2 pl-4 pr-9 focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer text-primary transition-all hover:bg-white shadow-sm"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23012d1d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '10px' }}
                >
                  <option value="farmer">{t('Farmer')}</option>
                  <option value="seller">{t('Seller')}</option>
                  <option value="customer">{t('Customer')}</option>
                </select>
            </div>
          </header>
        )}

        <main className="flex-1 relative z-10 overflow-y-auto overflow-x-hidden no-scrollbar pb-32">
          <div key={`${location.pathname}-${role}`} className="w-full min-h-full opacity-100 flex flex-col">
            <Outlet />
          </div>
        </main>

        {!hideNav && (
          <BottomNav />
        )}

        {/* Profile Completion Modal overlay */}
        {isModalOpen && (
          <ProfileCompletionModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            targetRole={pendingRole}
            user={user}
            onComplete={(data) => {
              // Register function inside modal or handled by layout
              setRole(data.role);
              navigate('/home');
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Layout;
