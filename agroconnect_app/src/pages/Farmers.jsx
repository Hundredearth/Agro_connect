import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, ChevronRight, User, Package, ShoppingCart } from 'lucide-react';
import { useRole } from '../context/RoleContext';
import BuyQuantityModal from '../components/BuyQuantityModal';

const Farmers = () => {
  const { profile, t } = useRole();
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [farmerProduce, setFarmerProduce] = useState([]);
  const [search, setSearch] = useState('');
  
  // Purchase states
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [message, setMessage] = useState(null);

  // Fetch farmers on mount
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await fetch('/api/farmers');
        const data = await res.json();
        setFarmers(data);
      } catch (err) {
        console.error('Failed to fetch farmers', err);
      }
    };
    fetchFarmers();
  }, []);

  // Fetch selected farmer's produce
  useEffect(() => {
    if (selectedFarmer) {
      const fetchProduce = async () => {
        try {
          const res = await fetch(`/api/produce/farmer/${selectedFarmer.id}`);
          const data = await res.json();
          setFarmerProduce(data);
        } catch (err) {
          console.error('Failed to fetch farmer produce', err);
        }
      };
      fetchProduce();
    } else {
      setFarmerProduce([]);
    }
  }, [selectedFarmer]);

  const handlePurchase = async (produceId, quantity) => {
    try {
      const res = await fetch('/api/purchase-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produceId,
          customerId: profile?.id,
          quantity
        })
      });
      if (res.ok) {
        setMessage('Purchase request sent successfully!');
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Failed to place request');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to place request');
    }
  };

  const filteredFarmers = farmers.filter(farmer => 
    farmer.fullName.toLowerCase().includes(search.toLowerCase()) ||
    (farmer.address && farmer.address.toLowerCase().includes(search.toLowerCase()))
  );

  if (selectedFarmer) {
    return (
      <div className="max-w-7xl mx-auto px-margin-mobile pt-6 space-y-stack-lg pb-32">
        <button 
          onClick={() => setSelectedFarmer(null)}
          className="text-primary font-bold flex items-center gap-2 mb-2"
        >
          <ChevronRight className="rotate-180" size={20} />
          {t("Back to Farmers")}
        </button>

        <section className="glass-card p-6 rounded-3xl space-y-4 border-l-4 border-primary shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-fixed/30 text-primary flex items-center justify-center font-black text-xl border">
              {selectedFarmer.fullName.charAt(0)}
            </div>
            <div>
              <h2 className="font-display-lg text-primary text-xl">{selectedFarmer.fullName}</h2>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-bold">
                <MapPin size={12} className="text-secondary" /> {selectedFarmer.address || t('Local Area')}
              </div>
              {selectedFarmer.phone && (
                <p className="text-[10px] text-on-surface-variant/60 font-semibold mt-1">{t("Phone:")} {selectedFarmer.phone}</p>
              )}
            </div>
          </div>
        </section>

        {message && (
          <div className="bg-secondary-container text-on-secondary-container px-4 py-3 rounded-2xl text-sm font-bold text-center">
            {message}
          </div>
        )}

        <section className="space-y-4">
          <h3 className="font-headline-md text-primary px-2">{t("Available Produce")}</h3>
          {farmerProduce.length === 0 ? (
            <p className="text-center text-on-surface-variant/60 py-8 font-medium">{t("No produce listed by this farmer yet.")}</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {farmerProduce.map(item => (
                <div key={item.id} className="glass-card p-5 rounded-3xl flex items-center justify-between shadow-sm border border-outline-variant/10">
                  <div>
                    <h4 className="font-bold text-primary text-lg">{item.name}</h4>
                    <p className="text-sm text-on-surface-variant">{item.stock} {t("kg available")} • <span className="text-secondary font-bold">${item.price.toFixed(2)} / kg</span></p>
                    {item.description && <p className="text-xs text-on-surface-variant/70 mt-1">{item.description}</p>}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProduct(item);
                      setIsBuyModalOpen(true);
                    }}
                    className="bg-primary text-on-primary p-3 rounded-2xl shadow-lg active:scale-95 transition-all"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedProduct && (
          <BuyQuantityModal 
            open={isBuyModalOpen}
            onClose={() => {
              setIsBuyModalOpen(false);
              setSelectedProduct(null);
            }}
            product={selectedProduct}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile pt-6 space-y-stack-lg pb-32">
      <section>
        <h1 className="font-display-lg text-display-lg text-primary">{t("Local Farmers")}</h1>
        <p className="font-body-base text-on-surface-variant">{t("Connect directly with producers in your area.")}</p>
      </section>

      <section className="glass-card p-4 rounded-2xl flex items-center gap-3">
        <Search size={20} className="text-outline" />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="bg-transparent border-none focus:ring-0 w-full text-sm outline-none text-primary" 
          placeholder={t("Search farmers by name or area...")} 
        />
      </section>

      <section className="space-y-4">
        {filteredFarmers.length === 0 ? (
          <p className="text-center text-on-surface-variant/60 py-8 font-medium">{t("No farmers found.")}</p>
        ) : (
          filteredFarmers.map(farmer => (
            <div 
              key={farmer.id} 
              onClick={() => setSelectedFarmer(farmer)}
              className="glass-card p-4 rounded-3xl flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow group"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary-fixed/30 text-primary flex items-center justify-center font-black text-xl flex-shrink-0 shadow-inner">
                {farmer.fullName.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-primary group-hover:text-secondary transition-colors">{farmer.fullName}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1 text-[10px] text-on-surface-variant font-bold uppercase">
                    <MapPin size={10} /> {farmer.address || t('Local Area')}
                  </div>
                </div>
                {farmer.farmSize && (
                  <p className="text-[10px] text-on-surface-variant/60 font-semibold mt-0.5">{t("Farm Size:")} {farmer.farmSize}</p>
                )}
              </div>
              <ChevronRight size={20} className="text-outline-variant group-hover:translate-x-1 transition-transform" />
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Farmers;
