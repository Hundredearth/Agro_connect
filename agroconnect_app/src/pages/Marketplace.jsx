import React from 'react';

const ProductCard = ({ title, farm, distance, price, unit, image, tag }) => {
  return (
    <div className="glass-card rounded-xl overflow-hidden flex flex-col hover:shadow-lg transition-all duration-300">
      <div className="relative h-48">
        <img className="w-full h-full object-cover" src={image} alt={title} />
        {tag && (
          <div className="absolute top-3 left-3 bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-uppercase text-label-uppercase">
            {tag}
          </div>
        )}
        <button className="absolute top-3 right-3 glass-card p-2 rounded-full text-primary">
          <span className="material-symbols-outlined">favorite</span>
        </button>
      </div>
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline-md text-[20px] text-primary">{title}</h3>
            <p className="text-body-sm font-body-sm text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span> {farm} • {distance}
            </p>
          </div>
          <div className="text-right">
            <span className="text-headline-md text-primary">${price}</span>
            <p className="text-body-sm font-body-sm text-on-surface-variant">/ {unit}</p>
          </div>
        </div>
        <div className="mt-stack-md flex gap-2">
          <button className="flex-grow bg-primary text-on-primary font-label-uppercase text-label-uppercase py-3 rounded-lg hover:bg-primary-container transition-colors active:scale-[0.98]">
            Order Now
          </button>
          <button className="px-4 border border-outline-variant rounded-lg text-primary hover:bg-secondary-container/20 transition-colors">
            <span className="material-symbols-outlined">shopping_cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const Marketplace = () => {
  const products = [
    {
      title: "Vine-Ripened Tomatoes",
      farm: "Green Valley Farm",
      distance: "1.2 mi",
      price: "4.50",
      unit: "kg",
      tag: "Organic",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCwJasVUdkPtcLwNY9WetkaQ1buxC8-nxaA5zoWcqfct6fMDjGWRqIxbISaQlkspt44MndP0EixjGrcDFcG3nmY8rsNoICVZ0AKWXPHFY4M5Xljcdkzng-bH8PmQkPWy5MokRlo5LyH56UBb9XTLKAdFVS_KZhSnP6zFPdWCw8Myf5tGatmjWtMx3JBTw0SgVES4rUVGscggSYHOnw5zBJhieCRLwj4UFEFADc82GqclZmIAoAhUlA1nIDJS6zdcJMRYTZKcXK_1Yr"
    },
    {
      title: "Curly Winter Kale",
      farm: "Urban Greens Hub",
      distance: "0.8 mi",
      price: "3.20",
      unit: "kg",
      tag: "Hydroponic",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwnWklXJDNHoyZrMApRpdqjKPBCxfG9ZiKEnHDERefANpKCZWaa6D4ebnhXbuP6Ltnp54QsIV7C_bkVPP2zydi_zT7RmFmmFyazv5fEhNMXt_jLUFrkdW_OayW5-a7kRkarvDoPoMnLS5N-MlSgJL0MWMMF9RdcLjMEaSBPj3bIsnrEpNn7_jHKqu3N-rEFFLhW2P_WgxR2bZcXGQbQ_uWCkCYVvNfwILDHnU74Nng4jyk5eENDlzs32IOzQPL3CJ1uTErHqj_VzWv"
    },
    {
      title: "Sweet Garden Strawberries",
      farm: "Sunbeam Orchards",
      distance: "3.5 mi",
      price: "6.80",
      unit: "kg",
      tag: "Best Seller",
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzNiOSyd2eFWxpwfFlb6TjtZaJHeFSXZb0kb4gg-dySVSXnqxmNuuzIyU-tHoTe47gKqHU8pR16moy2je8aW7tXc90ilKRlFNsp_k1YEcOYtbRHivA0573Z-NrzucBKG5yLNFaI211NElP-TSqtWeg9lENlpRMMvio47E8mIouzoEw_tPGakqvpTI2qx1MNA63POdYr9fCUFEkTGj1F0UIZmio9mzKY2wfclv1dvK0X-9j6m_wXGUi5HktIPJmNy3ZgUA44NJ59Gkm"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile pt-6">
      {/* Search & Filter Section */}
      <section className="mt-stack-md">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
          <input 
            className="w-full bg-surface-container-low border-none rounded-xl py-4 pl-12 pr-4 focus:ring-1.5 focus:ring-secondary transition-all placeholder:text-outline" 
            placeholder="Search fresh produce nearby..." 
            type="text"
          />
        </div>
        <div className="flex gap-stack-sm mt-stack-md overflow-x-auto no-scrollbar py-2">
          {["All Nearby", "Vegetables", "Fruits", "Organic", "Dairy"].map((cat, i) => (
            <button 
              key={cat}
              className={`px-6 py-2 rounded-full font-label-uppercase text-label-uppercase whitespace-nowrap active:scale-95 transition-transform ${i === 0 ? 'bg-secondary text-on-secondary' : 'bg-secondary-container/30 text-secondary hover:bg-secondary-container/50'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Map Visualization Section */}
      <section className="mt-stack-lg relative h-[200px] rounded-2xl overflow-hidden shadow-sm group">
        <img 
          className="w-full h-full object-cover grayscale-[20%]" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCizkVn-IpK-5MyUCPMzQO3Q1k3WSuReG5AX6h7NI37QXhqTPhY6HkIDEoauPALCYV7oRUv95jN_A8Jeq9607FBkQehG0lbbjgr01m-WszY64MlpaLKuEw4c2qZWICdNNhL6V1f_EWW-jskAFQ1Y2SorWG42agNDP-VKeR09L7rX1K203ZbXRmPd3KssH1MPFRCijw2twRN_Q4vIK3nJKcYlxiRW0plqF3SVtA_mmf6sBfaWg8gIilkhUxKNCbtZSlKYfB7J5kdz63q" 
          alt="Map"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent flex items-end p-6">
          <div className="glass-card p-4 rounded-xl flex items-center gap-stack-md">
            <div className="bg-secondary p-2 rounded-full text-white">
              <span className="material-symbols-outlined">explore</span>
            </div>
            <div>
              <p className="font-label-uppercase text-label-uppercase text-primary font-bold">12 Active Farms</p>
              <p className="text-body-sm font-body-sm text-on-surface-variant">Within 5 miles</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Feed */}
      <section className="mt-stack-lg">
        <div className="flex items-center justify-between mb-stack-md">
          <h2 className="font-headline-md text-headline-md text-primary">Fresh Picks Today</h2>
          <button className="text-secondary font-label-uppercase text-label-uppercase flex items-center gap-1">
            Sort <span className="material-symbols-outlined text-[18px]">expand_more</span>
          </button>
        </div>
        <div className="grid grid-cols-1 gap-gutter">
          {products.map((p, i) => (
            <ProductCard key={i} {...p} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Marketplace;
