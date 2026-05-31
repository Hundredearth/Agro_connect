import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, 
  ShoppingCart, 
  Search, 
  MessageSquare, 
  Shield, 
  Zap, 
  AlertTriangle, 
  CloudRain, 
  MapPin, 
  Plus, 
  ChevronRight, 
  Package, 
  List,
  UserCircle,
  Clock,
  X
} from 'lucide-react';
import { useRole } from '../context/RoleContext';
import BuyQuantityModal from '../components/BuyQuantityModal';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, subtext, color, trend }) => (
  <div className="glass-card p-6 rounded-[32px] border border-surface-container/50 bg-white/60 shadow-sm relative overflow-hidden group hover:bg-white transition-all">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
      <Icon size={24} />
    </div>
    <div className="space-y-0.5">
      <p className="text-on-surface-variant/40 font-black text-[9px] uppercase tracking-[0.2em]">{title}</p>
      <div className="flex items-end gap-2">
        <h3 className="text-primary font-display-lg text-2xl leading-none">{value}</h3>
      </div>
      <p className="text-on-surface-variant/60 text-[10px] font-medium pt-1">{subtext}</p>
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { role, profile, t } = useRole();
  const [showReportModal, setShowReportModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [message, setMessage] = useState(null);

  // Live Alerts states
  const [reports, setReports] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [reportType, setReportType] = useState('Disease'); // Disease, Pest, Weather
  const [postingReport, setPostingReport] = useState(false);

  // Geolocation Coordinates state (Bangalore fallback standard coordinates)
  const [userCoords, setUserCoords] = useState({
    latitude: 12.9716,
    longitude: 77.5946
  });

  // Weather State
  const [weather, setWeather] = useState({
    temp: '--',
    humidity: '--',
    windSpeed: '--',
    soilMoisture: 42,
    location: "Locating...",
    condition: "Fetching",
    loading: true
  });

  // Haversine Distance Calculator
  const getDistance = (lat1, lon1, lat2, lon2) => {
    if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return 0;
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth's Radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // returns distance in km
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get('/api/reports');
      setReports(res.data);
    } catch (e) {
      console.error('Failed to fetch reports', e);
    }
  };

  useEffect(() => {
    if (role === 'seller') {
      navigate('/inventory');
    }
  }, [role]);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (role === 'customer') {
      const fetchProducts = async () => {
        try {
          const res = await fetch('/api/produce');
          const data = await res.json();
          setProducts(data);
        } catch (err) {
          console.error("Failed to fetch products", err);
        }
      };
      fetchProducts();
    }
  }, [role]);

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

  // Capture Geolocation & Weather
  useEffect(() => {
    if (role !== 'customer' && role !== 'seller') {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          setUserCoords({ latitude: lat, longitude: lon });

          try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`);
            const weatherData = await weatherRes.json();
            
            let locName = "Your Farm";
            try {
              const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
              const geoData = await geoRes.json();
              locName = geoData.address.city || geoData.address.town || geoData.address.county || geoData.address.state || "Your Location";
            } catch (e) {
              console.log("Geocoding failed", e);
            }

            const current = weatherData.current;
            const code = current.weather_code;
            let condition = "Clear";
            if (code >= 1 && code <= 3) condition = "Partly Cloudy";
            else if (code >= 45 && code <= 48) condition = "Foggy";
            else if (code >= 51 && code <= 67) condition = "Rainy";
            else if (code >= 71 && code <= 77) condition = "Snowy";
            else if (code >= 80 && code <= 82) condition = "Showers";
            else if (code >= 95) condition = "Thunderstorm";

            setWeather({
              temp: Math.round(current.temperature_2m),
              humidity: current.relative_humidity_2m,
              windSpeed: Math.round(current.wind_speed_10m),
              soilMoisture: 42,
              location: locName,
              condition: condition,
              loading: false
            });

          } catch (error) {
            console.error("Weather fetch failed", error);
            setWeather(prev => ({ ...prev, loading: false, location: "Offline" }));
          }
        }, (error) => {
          setWeather(prev => ({ ...prev, loading: false, location: "Location Denied" }));
        });
      }
    }
  }, [role]);

  const handlePostReport = async (e) => {
    e.preventDefault();
    if (!reportTitle || !reportDescription || !profile?.id) return;
    setPostingReport(true);
    
    // Add offset slightly so we can simulate neighboring reports if they are testing
    // Generate a tiny random offset to mock neighboring farms (within 0.5km to 3km range)
    const randomOffsetLat = (Math.random() - 0.5) * 0.03; // ~1-3km offset
    const randomOffsetLon = (Math.random() - 0.5) * 0.03; 

    try {
      await axios.post('/api/reports', {
        farmerId: profile.id,
        type: reportType,
        title: reportTitle,
        description: reportDescription,
        latitude: userCoords.latitude + randomOffsetLat,
        longitude: userCoords.longitude + randomOffsetLon
      });

      setReportTitle('');
      setReportDescription('');
      setShowReportModal(false);
      fetchReports();
    } catch (e) {
      console.error('Failed to post report alert', e);
      alert('Failed to post community alert.');
    } finally {
      setPostingReport(false);
    }
  };

  // Filter reports that are within 5 km from current user location
  const nearbyAlerts = reports.map(report => {
    const distanceVal = getDistance(
      userCoords.latitude,
      userCoords.longitude,
      report.latitude,
      report.longitude
    );
    
    // Format descriptive time difference (e.g. 2h ago)
    const diffMs = Date.now() - new Date(report.createdAt).getTime();
    const diffHours = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60)));
    const timeString = diffHours >= 24 ? '1d ago' : `${diffHours}h ago`;

    return {
      ...report,
      distance: distanceVal,
      timeString
    };
  }).filter(report => report.distance <= 5.0); // Only within 5km radius!

  if (role === 'customer') {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-2 space-y-8 pb-32">
        <section className="space-y-1">
          <h1 className="font-display-lg text-primary text-3xl tracking-tight leading-none">{t("Fresh Harvest")}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t("Local & Organic Selection")}</p>
        </section>
        
        <section className="relative rounded-[40px] overflow-hidden h-[340px] shadow-2xl border-4 border-white">
          <img 
            className="absolute inset-0 w-full h-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLZPNy0DCcPdk5jSY0ktQq8uh9oTRGJUG05I8zXTbMyBJ4-BsNLqYwK6Nr0hpdt1eVnzQkrhGY_8sbAJ8tsHm1YWkyfhzzoE4eTBzanslMPSkNUWDJN1rv9hyq7bhK3dBCEwRoRP_MbEwUEvfzvbit-A0DIIQleILzKrOb-Mcf_b-__ICAyjk2CxAcTV8hp3mDEtKduUKV94ahcQzHEAd6sTqAqv7oUnIQJ1uQxL4LWAuJnlzc-jnBrSTegUpBthNhAytlsbHXOWgU" 
            alt="Farm" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/40 to-transparent p-8 flex flex-col justify-end items-start text-left">
            <span className="bg-secondary text-on-secondary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-3">{t("Trending Nearby")}</span>
            <h2 className="text-white font-display-lg text-3xl leading-tight mb-4">{t("Support Your Local Agriculture Heroes")}</h2>
            <button 
              onClick={() => navigate('/farmers')}
              className="bg-white text-primary px-8 py-4 rounded-[20px] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-secondary hover:text-on-secondary transition-all active:scale-95"
            >
              {t("Explore Farms")} <ChevronRight size={16} />
            </button>
          </div>
        </section>

        {message && (
          <div className="bg-secondary-container text-on-secondary-container px-4 py-3 rounded-2xl text-sm font-bold text-center">
            {message}
          </div>
        )}

        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="font-display-lg text-primary text-xl">{t("Recent Listings")}</h2>
            <button onClick={() => navigate('/farmers')} className="text-secondary font-black text-[10px] uppercase tracking-widest">{t("See All")}</button>
          </div>
          {products.length === 0 ? (
            <p className="text-center text-on-surface-variant/60 py-8 font-medium">{t("No produce listed yet.")}</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {products.map(product => (
                <div 
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsBuyModalOpen(true);
                  }}
                  className="glass-card p-4 rounded-[28px] space-y-3 bg-white/60 border border-surface-container/50 group cursor-pointer active:scale-95 transition-all"
                >
                  <div className="aspect-square bg-surface-container rounded-2xl overflow-hidden shadow-inner relative">
                    <img 
                      src={product.imageUrl || "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=400&auto=format&fit=crop&q=60"} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-110" 
                      alt={product.name}
                    />
                    <div className="absolute top-2 right-2 bg-primary/80 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                      {t("Stock:")} {product.stock}
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-primary text-sm line-clamp-1">{product.name}</p>
                    <p className="text-xs text-secondary font-black mt-0.5">${product.price.toFixed(2)} / kg</p>
                    {product.farmer && (
                      <p className="text-[10px] text-on-surface-variant/60 mt-1 flex items-center gap-1 font-medium">
                        <MapPin size={10} /> {product.farmer.fullName}
                      </p>
                    )}
                  </div>
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

  if (role === 'seller') {
    return (
      <div className="max-w-7xl mx-auto px-6 pt-2 space-y-8 pb-32">
        <section className="space-y-1">
          <h1 className="font-display-lg text-primary text-3xl tracking-tight leading-none">{t("Commerce Center")}</h1>
          <p className="text-on-surface-variant/60 text-xs font-bold uppercase tracking-widest">{t("Supply Chain Manager")}</p>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <StatCard icon={Package} title={t("STOCK ITEMS")} value={products.length.toString()} subtext={t("Active Store Stock")} color="bg-secondary-container text-on-secondary-container" />
          <StatCard icon={ShoppingCart} title={t("DAILY ORDERS")} value="12" subtext={t("Processing Now")} color="bg-primary-fixed text-on-primary-fixed" />
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-end px-2">
            <h2 className="font-display-lg text-primary text-xl">{t("Control Center")}</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <button onClick={() => navigate('/inventory')} className="glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 shadow-sm hover:bg-white transition-all active:scale-98 text-left group">
              <div className="bg-secondary/10 text-secondary p-4 rounded-[24px] group-hover:bg-secondary group-hover:text-white transition-all">
                <Plus size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-primary text-base">{t("Add New Supply")}</p>
                <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Update seeds, tools, or inputs")}</p>
              </div>
              <ChevronRight className="ml-auto text-on-surface-variant/20" />
            </button>
            <button onClick={() => navigate('/orders')} className="glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 shadow-sm hover:bg-white transition-all active:scale-98 text-left group">
              <div className="bg-primary/5 text-primary p-4 rounded-[24px] group-hover:bg-primary group-hover:text-white transition-all">
                <List size={28} strokeWidth={2.5} />
              </div>
              <div>
                <p className="font-bold text-primary text-base">{t("Order Management")}</p>
                <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Fulfill customer requests")}</p>
              </div>
              <ChevronRight className="ml-auto text-on-surface-variant/20" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pt-2 space-y-8 pb-32">
      {/* Weather Hero Card */}
      <section className="relative rounded-[40px] overflow-hidden p-8 shadow-2xl border-4 border-white bg-gradient-to-br from-primary to-primary-dark group">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] aspect-square bg-white/5 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-white/40 font-black text-[10px] uppercase tracking-[0.2em]">{t(weather.location)}</p>
              <h1 className="text-white font-display-lg text-3xl leading-none">{t("Farmer Portal")}</h1>
            </div>
            <div className="bg-white/10 backdrop-blur-xl p-3 rounded-[24px] border border-white/10">
              <CloudRain size={28} className="text-secondary" />
            </div>
          </div>

          <div className="flex items-end gap-4">
            <span className="text-white font-display-lg text-6xl leading-none">{weather.temp}°</span>
            <div className="mb-2 space-y-0.5">
              <div className={`flex items-center gap-2 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${weather.condition.includes('Rain') || weather.condition.includes('Thunder') || weather.condition.includes('Showers') ? 'bg-error/20 text-error-container border-error/10' : 'bg-secondary/20 text-secondary border-secondary/10'}`}>
                <AlertTriangle size={12} /> {t(weather.condition)}
              </div>
              <p className="text-white/60 text-xs font-medium">{t("Currently observed conditions")}</p>
            </div>
          </div>

          <div className="pt-2 flex gap-8">
            <div className="space-y-1">
              <p className="text-white/30 font-black text-[9px] uppercase tracking-widest">{t("Humidity")}</p>
              <p className="text-white font-black text-sm">{weather.humidity}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/30 font-black text-[9px] uppercase tracking-widest">{t("Wind Speed")}</p>
              <p className="text-white font-black text-sm">{weather.windSpeed} km/h</p>
            </div>
            <div className="space-y-1">
              <p className="text-white/30 font-black text-[9px] uppercase tracking-widest">{t("Soil Moisture")}</p>
              <p className="text-white font-black text-sm">{weather.soilMoisture}%</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Alerts */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-2">
          <div className="space-y-0.5">
            <h2 className="font-display-lg text-primary text-xl">{t("Community Alerts")}</h2>
            <p className="text-on-surface-variant/40 text-[10px] font-black uppercase tracking-widest">{t("Within 5km radius (Last 24h)")}</p>
          </div>
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-primary text-on-primary p-3 rounded-2xl shadow-xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 pt-1">
          {nearbyAlerts.length === 0 ? (
            <div className="w-full mx-6 p-8 glass-card bg-white/40 rounded-[32px] border border-surface-container/40 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-secondary/15 rounded-2xl flex items-center justify-center text-secondary mb-3">
                <Shield size={24} />
              </div>
              <p className="text-xs font-bold text-primary">{t("No threats in your 5km range")}</p>
              <p className="text-[10px] text-on-surface-variant/70 mt-1 max-w-[200px]">{t("Tap the '+' button above to report any pest activity or disease warnings you spot!")}</p>
            </div>
          ) : (
            nearbyAlerts.map(report => (
              <div key={report.id} className="flex-shrink-0 w-[240px] glass-card p-5 rounded-[32px] border border-surface-container/50 bg-white/60 space-y-3 shadow-sm relative">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    report.type === 'Pest' ? 'bg-amber-500/10 text-amber-500' : report.type === 'Weather' ? 'bg-info/10 text-info' : 'bg-error/10 text-error'
                  }`}>
                    <AlertTriangle size={20} />
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-bold text-primary text-sm line-clamp-1">{report.title}</h4>
                    <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-widest">{t(report.type)}</p>
                  </div>
                </div>
                <p className="text-[11px] text-on-surface-variant/80 line-clamp-2 leading-relaxed h-8">
                  {report.description}
                </p>
                <div className="flex justify-between items-center bg-surface-container/30 px-3.5 py-2 rounded-xl text-[9px] font-bold text-on-surface-variant/60">
                  <span className="flex items-center gap-1"><MapPin size={10} /> {report.distance.toFixed(1)}km</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {report.timeString}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Farmer Services */}
      <section className="space-y-4">
        <h2 className="font-display-lg text-primary text-xl px-2">{t("Farmer Services")}</h2>
        <div className="grid grid-cols-1 gap-4">
          <button 
            onClick={() => navigate('/scan')}
            className="glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 shadow-sm hover:bg-white transition-all active:scale-98 text-left group"
          >
            <div className="bg-secondary/10 text-secondary p-4 rounded-[24px] group-hover:bg-secondary group-hover:text-white transition-all shadow-lg shadow-secondary/5">
              <Zap size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-primary text-base">{t("AI Crop Diagnostic")}</p>
              <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Scan crops for instant health analysis")}</p>
            </div>
            <ChevronRight className="text-on-surface-variant/20" />
          </button>

          <button 
            onClick={() => navigate('/shop')}
            className="glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 shadow-sm hover:bg-white transition-all active:scale-98 text-left group"
          >
            <div className="bg-primary/5 text-primary p-4 rounded-[24px] group-hover:bg-primary group-hover:text-white transition-all shadow-lg shadow-primary/5">
              <ShoppingCart size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-primary text-base">{t("Agri-Market")}</p>
              <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Buy seeds and pesticides from sellers")}</p>
            </div>
            <ChevronRight className="text-on-surface-variant/20" />
          </button>

          <button 
            onClick={() => navigate('/assistant')}
            className="glass-card p-6 rounded-[32px] flex items-center gap-5 border border-surface-container/50 bg-white/60 shadow-sm hover:bg-white transition-all active:scale-98 text-left group"
          >
            <div className="bg-tertiary/10 text-tertiary p-4 rounded-[24px] group-hover:bg-tertiary group-hover:text-white transition-all shadow-lg shadow-tertiary/5">
              <MessageSquare size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <p className="font-bold text-primary text-base">{t("AgroAI Assistant")}</p>
              <p className="text-[11px] text-on-surface-variant/60 font-medium">{t("Chat with your personalized farm expert")}</p>
            </div>
            <ChevronRight className="text-on-surface-variant/20" />
          </button>
        </div>
      </section>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/60 backdrop-blur-md">
          <div className="glass-card w-full max-w-sm p-6 rounded-[36px] bg-white border border-white shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h3 className="font-display-lg text-primary text-xl font-black">{t("Report Threat")}</h3>
                <p className="text-[9px] text-on-surface-variant/40 font-black uppercase tracking-widest">{t("Warn local farmers in 5km")}</p>
              </div>
              <button 
                onClick={() => setShowReportModal(false)}
                className="bg-surface-container/50 text-primary p-2 rounded-full active:scale-90 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handlePostReport} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">{t("Threat Type")}</label>
                <select 
                  value={reportType} 
                  onChange={e => setReportType(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm text-primary font-bold focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23012d1d'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px center', backgroundSize: '12px' }}
                >
                  <option value="Disease">{t("Disease Sighting")}</option>
                  <option value="Pest">{t("Pest Infestation")}</option>
                  <option value="Weather">{t("Extreme Weather")}</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">{t("Title")}</label>
                <input 
                  required
                  value={reportTitle}
                  onChange={e => setReportTitle(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none" 
                  placeholder={t("e.g. Tomato Leaf Rust spotted")} 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-on-surface-variant uppercase tracking-widest ml-1">{t("Description")}</label>
                <textarea 
                  required
                  value={reportDescription}
                  onChange={e => setReportDescription(e.target.value)}
                  className="w-full bg-surface-container/30 border border-outline-variant/10 rounded-2xl px-4 py-3 h-24 text-sm font-bold text-primary focus:ring-2 focus:ring-primary/20 outline-none resize-none" 
                  placeholder={t("Describe crop symptoms, weather, severity...")} 
                />
              </div>

              <button 
                type="submit" 
                disabled={postingReport}
                className="w-full bg-primary text-on-primary py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all mt-4 flex items-center justify-center gap-2"
              >
                {postingReport ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Plus size={14} />
                    {t("Post Live Warning")}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
