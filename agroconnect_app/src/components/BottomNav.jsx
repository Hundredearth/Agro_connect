import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ShoppingCart, Search, MessageSquare, User, Package, List } from 'lucide-react';
import { useRole } from '../context/RoleContext';

const BottomNav = () => {
  const { role, t } = useRole();

  const navItems = {
    farmer: [
      { to: "/home", label: "Home", icon: Home },
      { to: "/shop", label: "Market", icon: ShoppingCart },
      { to: "/scan", label: "Scan", icon: Search, primary: true },
      { to: "/products", label: "Products", icon: Package },
      { to: "/profile", label: "Profile", icon: User },
    ],
    customer: [
      { to: "/home", label: "Home", icon: Home },
      { to: "/farmers", label: "Farmers", icon: Search },
      { to: "/orders", label: "Orders", icon: List },
      { to: "/profile", label: "Profile", icon: User },
    ],
    seller: [
      { to: "/inventory", label: "Stock", icon: Package },
      { to: "/orders", label: "Orders", icon: List },
      { to: "/profile", label: "Profile", icon: User },
    ]
  };

  const items = navItems[role] || navItems.farmer;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-[100] px-4 pb-2 pt-2 pointer-events-auto w-full">
      <div className="glass-card rounded-[32px] px-2 py-2.5 flex justify-around items-center shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 mb-2">
        {items.map((item) => (
          <NavLink 
            key={item.to}
            to={item.to} 
            className={({ isActive }) => `relative flex flex-col items-center justify-center py-2 px-1.5 rounded-2xl transition-all duration-300 ${
              isActive && !item.primary ? 'text-primary' : 'text-on-surface-variant/40'
            }`}
          >
            {({ isActive }) => (
              <>
                {item.primary ? (
                  <div className="bg-primary text-on-primary p-4 rounded-full -mt-8 shadow-[0_10px_30px_rgba(1,45,29,0.3)] border-[6px] border-white hover:scale-110 active:scale-95 transition-all">
                    <item.icon size={26} strokeWidth={2.5} />
                  </div>
                ) : (
                  <>
                    <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                    <span className={`text-[10px] mt-1.5 font-black tracking-widest uppercase transition-all duration-300 ${
                      isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-75 h-0 overflow-hidden'
                    }`}>
                      {t(item.label)}
                    </span>
                    {isActive && (
                      <div className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full"></div>
                    )}
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
      
      {/* Integrated Home Indicator */}
      <div className="w-full flex justify-center pb-2 opacity-30">
        <div className="w-32 h-1.5 bg-primary rounded-full"></div>
      </div>
    </nav>
  );
};

export default BottomNav;
