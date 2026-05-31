import React from 'react';
import { useRole } from '../context/RoleContext';
import Supplies from './Supplies';
import { ShoppingBasket } from 'lucide-react';

const Shop = () => {
  const { role, t } = useRole();

  if (role !== 'farmer') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] px-8 text-center">
        <ShoppingBasket size={64} className="text-outline-variant mb-4" />
        <h2 className="font-display-lg text-primary text-2xl font-black">{t("Market Not Available")}</h2>
        <p className="text-on-surface-variant text-sm mt-1 max-w-[280px]">{t("The Agri-Market is currently optimized for Farmers to purchase supplies.")}</p>
      </div>
    );
  }

  return (
    <Supplies />
  );
};

export default Shop;
