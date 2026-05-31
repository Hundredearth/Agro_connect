import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../context/RoleContext';

const ProduceCard = ({ title, price, unit, trend, image }) => {
  const { t } = useRole();
  return (
    <div className="glass-card p-unit rounded-xl space-y-stack-sm">
      <div className="h-32 w-full rounded-lg overflow-hidden bg-surface-container">
        <img className="w-full h-full object-cover" src={image} alt={t(title)} />
      </div>
      <div>
        <h4 className="font-body-base font-semibold text-primary">{t(title)}</h4>
        <p className="font-label-uppercase text-label-uppercase text-on-surface-variant">${price} / {t(unit)}</p>
      </div>
      <div className={`text-[10px] inline-block px-2 py-0.5 rounded-full font-bold ${trend === 'Trending Up' || trend === 'In Demand' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container text-on-surface-variant'}`}>
        {t(trend)}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useRole();

  return (
    <div className="max-w-7xl mx-auto px-margin-mobile pt-6 space-y-stack-lg">
      <section>
        <h1 className="font-display-lg text-display-lg text-primary">{t("Good morning, Alex")}</h1>
        <p className="font-body-base text-on-surface-variant">{t("Your farm is looking healthy today. 3 alerts need your attention.")}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="glass-card md:col-span-2 p-stack-md rounded-2xl flex items-center justify-between shadow-[0px_10px_30px_rgba(27,67,50,0.08)]">
          <div className="space-y-unit">
            <span className="font-label-uppercase text-label-uppercase text-on-surface-variant">{t("WEATHER STATUS")}</span>
            <div className="flex items-center gap-stack-sm">
              <span className="material-symbols-outlined text-4xl text-on-secondary-container">light_mode</span>
              <span className="font-display-lg text-display-lg text-primary">28°C</span>
            </div>
            <p className="font-body-sm text-on-surface-variant">{t("Partly cloudy • High humidity (74%)")}</p>
          </div>
          <div className="hidden sm:block h-24 w-32 rounded-lg overflow-hidden relative">
            <img className="object-cover w-full h-full opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUyR4RPuQgLERoWYJsCV4x96fEmnTxho5ZZbBm64CijqPRRkk5PLMNds7A62efGKR8cJMO91nVFQVW5TLSd70sPGBuuIGvml26mtWLzjigX9Bv6lg2cjDbS-P5QtyhhiRAC2TkYIPx0FyNC41F0RZXLlznWsozPXXmhnwrmo4lhWb4S7xv-Tx1C5Z8gIaqjNr_BSbxERLxsjg8b-LGHsVXu_kuDTT_Dw158Z__rvh9Yzoiv-aWX_yTdnzXNib7yb2xTUH80x-4yoPf" alt="Landscape" />
          </div>
        </div>

        <div className="bg-error-container p-stack-md rounded-2xl border border-error/10 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="material-symbols-outlined text-on-error-container">bug_report</span>
            <span className="bg-error text-on-error px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">{t("High Risk")}</span>
          </div>
          <div className="mt-4">
            <h3 className="font-headline-md text-headline-md text-on-error-container text-lg">{t("Pest Warning")}</h3>
            <p className="font-body-sm text-on-error-container">{t("Fall Armyworm activity detected nearby.")}</p>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-gutter">
        <button 
          onClick={() => navigate('/scan')}
          className="w-full bg-primary text-on-primary py-stack-md rounded-2xl flex items-center justify-center gap-stack-sm shadow-xl hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-2xl">document_scanner</span>
          <span className="font-headline-md text-headline-md text-xl">{t("Scan Crop for AI Detection")}</span>
        </button>

        <button 
          onClick={() => navigate('/inventory')}
          className="w-full bg-secondary-container text-on-secondary-container py-stack-md rounded-2xl flex items-center justify-center gap-stack-sm shadow-md hover:opacity-90 active:scale-[0.98] transition-all"
        >
          <span className="material-symbols-outlined text-2xl">inventory_2</span>
          <span className="font-headline-md text-headline-md text-xl">{t("Manage Farm Inventory")}</span>
        </button>
      </section>

      <section className="space-y-stack-md">
        <div className="flex justify-between items-end px-unit">
          <h2 className="font-headline-md text-headline-md text-primary">{t("Market Summary")}</h2>
          <span className="font-label-uppercase text-label-uppercase text-on-secondary-container">{t("See All")}</span>
        </div>
        <div className="grid grid-cols-2 gap-gutter">
          <ProduceCard 
            title="Potatoes (Grade A)"
            price="2.40"
            unit="kg"
            trend="Trending Up"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuCKTRTluANpJc9e7LCsAF_t3mBXCbfeMQCaXrT20WbArYvqtuge1G5-x-7q-spLDdrNSzYNGTJeFEyfusTKTwCbHgEpZEUnvdiPb8WXuCh89dVB6B4fYpjCIjQiN4pe2TNsC2wxoiaBM8R8t7QNhnPtxh4iBMw3gIQTKzDDlretXT_RVzbH0N6xsxuxS3Zz9zUhBmUDs9DjEIBM6YF3Yx0DHxA8468rp4XBMzUGFG9Np6sIKNGU985old5KDGCdzYiRjOnRbO20i6kX"
          />
          <ProduceCard 
            title="Cherry Tomatoes"
            price="4.10"
            unit="kg"
            trend="Stable"
            image="https://lh3.googleusercontent.com/aida-public/AB6AXuBnUcXAYm85WaiiQ37mcBENDcrF9zRmGwtjt6RWTnfVZ_D3ju2WtaoRopjZzIEowbUwWhTf4ToByFDZgBD7XIsnF31JK0hSDrxFo9Et1w4WZOY0GD-eIq4kyXMLYDp2a0JwkB_KhzFS5GvE7hgodOsi31opKvyDIggxrVaASHU0FOQOreUAJVTZk_PKiq9-ci6a9_oTIPU8IOliPhqVWUQoQLqLpCcMHuJPF0bd7HrDcZVTwDsHzyxi4ju1uqOxreo04E2Klqd19D2B"
          />
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
