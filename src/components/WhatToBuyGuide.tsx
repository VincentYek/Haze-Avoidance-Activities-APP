import React, { useState } from 'react';
import {
  ShoppingBag,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Phone,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { MEDICAL_SUPPLIES, PHARMACY_CHAINS, IMAGES } from '../data/hazeData';

export const WhatToBuyGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = [
    'All',
    'Respiratory Protection',
    'Eye Care',
    'Throat & Nasal',
    'Medication & Devices',
  ];

  const filteredSupplies = MEDICAL_SUPPLIES.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="space-y-8">
      {/* Visual Billboard with 3M Aura N95 Studio Feature */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">Value Proposition 2</span>
              <span aria-hidden="true">·</span>
              <span>Essential Tourist Haze Kit</span>
              <span aria-hidden="true">·</span>
              <span>Singapore Price Benchmarks</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              What to Buy in Singapore & Where to Find Genuine Stock
            </h1>

            <p className="text-slate-600 text-sm leading-relaxed">
              Don’t fall for overpriced or ineffective masks. Understand why certified N95 respirators are necessary for fine PM2.5 smoke, discover doctor-recommended eye and nasal essentials, and locate official 24-hour Singapore pharmacies.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="font-bold text-slate-900">Price Regulated:</span>
              <span className="text-slate-600">Standard SGD retail pricing enforced across all national chains</span>
            </div>
          </div>

          <div className="lg:col-span-5 relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-50 shadow-inner group">
            <img
              src={IMAGES.n95Studio}
              alt="Certified 3M Aura N95 Respirator"
              referrerPolicy="no-referrer"
              className="w-full h-64 object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-3 left-3 right-3 p-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-[11px] flex items-center justify-between">
              <span className="font-semibold">3M Aura 9320A+ / 9205+</span>
              <span className="text-emerald-400 font-bold">NIOSH Certified N95</span>
            </div>
          </div>
        </div>
      </section>

      {/* Visual N95 vs Surgical Comparison Card Deck */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
        <div className="max-w-2xl mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Critical Tourist Truth
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900">
            Why Ordinary Surgical Masks Fail Against Haze
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
            The #1 mistake tourists make is wearing standard blue surgical masks. Here is why Singapore health authorities advise against them:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* N95 Respirator Card */}
          <div className="p-6 rounded-3xl border-2 border-emerald-300 bg-emerald-50/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-base">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Certified N95 Respirator</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white">
                MOH RECOMMENDED
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Engineered with electrostatically charged microfibers that capture $\ge$95% of fine airborne smoke particles (0.1–0.3 µm). Forms an airtight custom seal against your face.
            </p>

            <div className="pt-2 border-t border-emerald-200/80 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="font-bold text-slate-900 block">Facial Seal:</span>
                <span className="text-slate-600">Airtight fit over bridge & chin</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Standard Price:</span>
                <span className="text-emerald-800 font-semibold">S$2.50 – S$3.50 per pc</span>
              </div>
            </div>
          </div>

          {/* Standard Surgical Mask Card */}
          <div className="p-6 rounded-3xl border-2 border-rose-300 bg-rose-50/40 relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-900 font-extrabold text-base">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Standard Surgical / Paper Mask</span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-600 text-white">
                INSUFFICIENT
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">
              Designed only to block large liquid droplets from coughing. PM2.5 smoke particles easily pass right through the loose edges around your cheeks and large filter pores.
            </p>

            <div className="pt-2 border-t border-rose-200/80 grid grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="font-bold text-slate-900 block">Edge Leakage:</span>
                <span className="text-rose-700 font-semibold">Over 60% unfiltered air bypass</span>
              </div>
              <div>
                <span className="font-bold text-slate-900 block">Haze Rating:</span>
                <span className="text-slate-600">False sense of security</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Visual Fit Guide */}
        <div className="mt-8 p-5 rounded-2xl bg-slate-50 border border-slate-200">
          <span className="text-xs font-bold text-slate-900 block mb-3">
            Quick 4-Step N95 Seal Check (Test Before Leaving Hotel):
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">1. Cup In Hand</span>
              <span>Position the mask securely over your nose bridge and chin.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">2. Dual Straps</span>
              <span>Pull upper strap to crown of head, lower strap below ears.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">3. Nose Strip</span>
              <span>Mould the flexible metal strip with both index fingers.</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200/70">
              <span className="font-bold text-slate-900 block mb-1">4. Inhale Check</span>
              <span>Breathe sharply in: mask should pull slightly in without air leaks.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Recommended Singapore Tourist Haze Kit
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Available over-the-counter across all authorized retail pharmacies
            </p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSupplies.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-3xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                  <span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                    {item.category}
                  </span>
                  <span className="font-mono font-bold text-slate-900 text-xs">
                    {item.singaporePriceSgd}
                  </span>
                </div>

                <h3 className="font-extrabold text-slate-900 text-base mb-2 leading-snug">
                  {item.name}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {item.whyNeeded}
                </p>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div>
                    <span className="font-bold text-slate-800">Top Brands: </span>
                    {item.recommendedBrands.join(', ')}
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Advice: </span>
                    {item.usageAdvice}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Stock: <strong className="text-emerald-700">{item.stockAvailability}</strong></span>
                <span>{item.retailers[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Major Pharmacy Chains & 24/7 Outlets */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Where to Buy: Major Pharmacy Chains & 24/7 Outlets
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Convenient airport, town, and MRT station branches with registered pharmacists on duty
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PHARMACY_CHAINS.map((chain) => (
            <div
              key={chain.name}
              className="p-6 rounded-3xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-extrabold text-slate-900 text-lg">{chain.name}</h3>
                  <span className="text-xs font-semibold text-slate-500">{chain.outletCount}</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{chain.operatingHours}</span>
                </div>

                <div className="space-y-1.5 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Key Tourist Branches:
                  </span>
                  <ul className="text-xs text-slate-700 space-y-1.5">
                    {chain.popularTouristOutlets.map((loc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>{loc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <a
                  href={`tel:${chain.hotline.replace(/\s+/g, '')}`}
                  className="inline-flex items-center gap-1.5 font-bold text-slate-900 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{chain.hotline}</span>
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    chain.name + ' Singapore'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold"
                >
                  <span>Locate Outlets</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
