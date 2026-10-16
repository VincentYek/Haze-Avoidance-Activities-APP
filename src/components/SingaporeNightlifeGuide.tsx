import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  MapPin,
  Star,
  ExternalLink,
  ShieldCheck,
  Compass,
  Train,
  Heart,
  Shuffle,
  X,
  Clock,
  Sparkles,
  Info,
  DollarSign,
  Share2,
  Music,
  Wine,
  Disc,
  Gamepad2,
  Moon,
  ChevronRight,
  SlidersHorizontal,
  Flame,
  Shirt,
  Volume2,
} from 'lucide-react';
import { Nightspot, NightspotCategory, DressCode, NightspotShelter } from '../types/nightspot';
import { SINGAPORE_NIGHTSPOTS, NIGHTSPOT_CATEGORIES } from '../data/nightspotsData';

interface SingaporeNightlifeGuideProps {
  currentPsi?: number;
  onNavigateToTab?: (tab: string) => void;
}

export const SingaporeNightlifeGuide: React.FC<SingaporeNightlifeGuideProps> = ({
  currentPsi = 68,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<NightspotCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDressCode, setSelectedDressCode] = useState<DressCode | 'all'>('all');
  const [selectedShelter, setSelectedShelter] = useState<NightspotShelter | 'all'>('all');
  const [filterShelteredOnly, setFilterShelteredOnly] = useState<boolean>(false);
  const [selectedPrice, setSelectedPrice] = useState<string>('all');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('captain_haze_saved_nightspots');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeModalSpot, setActiveModalSpot] = useState<Nightspot | null>(null);
  const [randomModalSpot, setRandomModalSpot] = useState<Nightspot | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Sync saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('captain_haze_saved_nightspots', JSON.stringify(savedIds));
    } catch (err) {
      console.error('Failed to save nightspots to localStorage:', err);
    }
  }, [savedIds]);

  const toggleSaveSpot = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter logic
  const filteredNightspots = useMemo(() => {
    return SINGAPORE_NIGHTSPOTS.filter((spot) => {
      // Saved filter
      if (showSavedOnly && !savedIds.includes(spot.id)) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && spot.category !== selectedCategory) {
        return false;
      }

      // Dress code filter
      if (selectedDressCode !== 'all' && spot.dressCode !== selectedDressCode) {
        return false;
      }

      // Shelter filter
      if (selectedShelter !== 'all' && spot.shelterLevel !== selectedShelter) {
        return false;
      }

      // Sheltered MRT access
      if (filterShelteredOnly && !spot.shelteredMrtAccess) {
        return false;
      }

      // Price filter
      if (selectedPrice !== 'all' && spot.priceTier !== selectedPrice) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = spot.name.toLowerCase().includes(q);
        const matchesCategory = spot.category.toLowerCase().includes(q);
        const matchesVibe = spot.vibe.toLowerCase().includes(q);
        const matchesMusic = spot.musicGenre.toLowerCase().includes(q);
        const matchesArea = spot.area.toLowerCase().includes(q);
        const matchesMrt = spot.nearestMrt.toLowerCase().includes(q);
        const matchesCocktails = spot.signatureCocktails.some(
          (c) =>
            c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
        );
        const matchesDesc = spot.description.toLowerCase().includes(q);

        if (!matchesName && !matchesCategory && !matchesVibe && !matchesMusic && !matchesArea && !matchesMrt && !matchesCocktails && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedCategory,
    selectedDressCode,
    selectedShelter,
    filterShelteredOnly,
    selectedPrice,
    searchQuery,
    showSavedOnly,
    savedIds,
  ]);

  const handleSurpriseMe = () => {
    const pool = filteredNightspots.length > 0 ? filteredNightspots : SINGAPORE_NIGHTSPOTS;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setRandomModalSpot(pool[randomIndex]);
  };

  const handleCopyShare = (spot: Nightspot) => {
    const text = `Check out ${spot.name} in Singapore (${spot.category}, ${spot.area})! Vibe: ${spot.vibe}. Nearest MRT: ${spot.nearestMrt}. Must-try: ${spot.signatureCocktails[0]?.name}.`;
    navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getCategoryIcon = (category: NightspotCategory | 'All') => {
    switch (category) {
      case 'Speakeasy & Cocktail Bar':
        return <Wine className="w-4 h-4" />;
      case 'Live Music & Jazz Lounge':
        return <Music className="w-4 h-4" />;
      case 'Mega Nightclub & Dance':
        return <Disc className="w-4 h-4" />;
      case 'Arcade & Social Entertainment':
        return <Gamepad2 className="w-4 h-4" />;
      case 'Enclosed Sky Lounge':
        return <Moon className="w-4 h-4" />;
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Banner with Night Ambiance */}
      <section className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-indigo-900/40">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-violet-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-violet-300 text-xs font-semibold tracking-wide border border-violet-500/30">
            <Moon className="w-3.5 h-3.5" />
            <span>Singapore Indoor Nightlife & Entertainment</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Top Indoor Nightspots & Speakeasies in Singapore
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            From the 1920s Art Deco grand gin palace at <span className="text-white font-medium">ATLAS</span> and secret speakeasies hidden behind fridge doors, to subterranean jazz clubs, retro arcade bars, and <span className="text-white font-medium">MARQUEE’s</span> 3-storey indoor Ferris wheel. All venues feature 100% enclosed climate control or subterranean shelter so you can celebrate without breathing nighttime smoke haze.
          </p>

          {/* Night Haze Protection Pill */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium ${
              currentPsi > 100
                ? 'bg-amber-950/80 border border-amber-500/50 text-amber-200'
                : 'bg-indigo-900/60 border border-indigo-700/50 text-indigo-200'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {currentPsi > 100
                  ? `Evening PSI is ${currentPsi} (Elevated). Avoid outdoor rooftop terraces; these verified indoor nightspots provide filtered climate control.`
                  : `Evening air quality is currently clear (PSI ${currentPsi}). Indoor venues offer peak acoustic immersion and late-night AC comfort.`}
              </span>
            </div>

            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-sm active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Match My Night Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Interactive Controls */}
      <section className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200 space-y-5">
        {/* Search Bar + Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cocktails (e.g. Martini, Highball), venues (e.g. ATLAS, Zouk, Marquee), music genre, or MRT..."
              className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-900 focus:border-transparent text-sm bg-slate-50 placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-colors ${
                showSavedOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${showSavedOnly ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Saved Spots ({savedIds.length})</span>
            </button>

            <button
              onClick={handleSurpriseMe}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-sm"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pick for Me</span>
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
            Entertainment Category ({NIGHTSPOT_CATEGORIES.length - 1} Distinct Styles)
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {NIGHTSPOT_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isSelected ? 'text-violet-400' : 'text-slate-500'}>
                    {getCategoryIcon(cat.id)}
                  </span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-slate-700 text-violet-300' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Refinements Bar */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-500 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine:</span>
          </div>

          {/* Dress Code Dropdown */}
          <select
            value={selectedDressCode}
            onChange={(e) => setSelectedDressCode(e.target.value as DressCode | 'all')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Dress Codes</option>
            <option value="Smart Casual">Smart Casual (Shirts, Pants)</option>
            <option value="Club Chic">Club Chic (Party, Stylish)</option>
            <option value="Upscale / Glamorous">Upscale / Glamorous</option>
            <option value="Casual / Neat">Casual / Neat (Arcade/Social)</option>
          </select>

          {/* Shelter Type Dropdown */}
          <select
            value={selectedShelter}
            onChange={(e) => setSelectedShelter(e.target.value as NightspotShelter | 'all')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Indoor Shelters</option>
            <option value="HEPA-Filtered Indoor Complex">HEPA-Filtered Mega Complex</option>
            <option value="Subterranean Speakeasy (Zero Outdoor Exposure)">Subterranean (Underground)</option>
            <option value="Fully Enclosed Air-Conditioned Shophouse">Enclosed Shophouse</option>
            <option value="High-Altitude Sealed Sky Lounge">High-Altitude Sealed Sky Lounge</option>
          </select>

          {/* Sheltered MRT Access Toggle */}
          <button
            onClick={() => setFilterShelteredOnly(!filterShelteredOnly)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-medium transition-colors ${
              filterShelteredOnly
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Train className="w-3.5 h-3.5 text-blue-600" />
            <span>Sheltered MRT Direct</span>
          </button>

          {/* Price Tier Filter */}
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Price Ranges</option>
            <option value="$$">$$ (Casual Drinks & Arcades)</option>
            <option value="$$$">$$$ (Premium Craft Cocktails)</option>
            <option value="$$$$">$$$$ (Luxury Lounges & VIP Clubs)</option>
          </select>

          {/* Reset Filters */}
          {(selectedCategory !== 'All' ||
            selectedDressCode !== 'all' ||
            selectedShelter !== 'all' ||
            filterShelteredOnly ||
            selectedPrice !== 'all' ||
            searchQuery ||
            showSavedOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedDressCode('all');
                setSelectedShelter('all');
                setFilterShelteredOnly(false);
                setSelectedPrice('all');
                setSearchQuery('');
                setShowSavedOnly(false);
              }}
              className="ml-auto text-xs text-rose-600 hover:text-rose-700 underline font-medium"
            >
              Reset all filters
            </button>
          )}
        </div>
      </section>

      {/* Results Header */}
      <div className="flex items-center justify-between text-sm text-slate-600 px-1">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredNightspots.length}</span> verified nightspots
          {selectedCategory !== 'All' && <span> in <strong className="text-slate-900">{selectedCategory}</strong></span>}
        </div>
        <div className="text-xs text-slate-500">
          Tip: Tap any venue to view signature drinks, cover charges & entrance directions
        </div>
      </div>

      {/* Nightspots Grid */}
      {filteredNightspots.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No nightspots match your criteria</h3>
          <p className="text-sm text-slate-500">
            Try adjusting your category, dress code, or clearing your search.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedDressCode('all');
              setSelectedShelter('all');
              setFilterShelteredOnly(false);
              setSelectedPrice('all');
              setSearchQuery('');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNightspots.map((spot) => {
            const isSaved = savedIds.includes(spot.id);
            return (
              <div
                key={spot.id}
                onClick={() => setActiveModalSpot(spot)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden relative"
              >
                {/* Top Badge Strip */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-900 text-white flex items-center gap-1">
                        {getCategoryIcon(spot.category)}
                        <span>{spot.category}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {spot.priceTier}
                      </span>
                      {spot.awardOrBadge && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-violet-50 text-violet-800 border border-violet-200/80 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-violet-500 text-violet-500" />
                          <span className="truncate max-w-[130px]">{spot.awardOrBadge}</span>
                        </span>
                      )}
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleSaveSpot(spot.id, e)}
                      title={isSaved ? 'Remove from saved' : 'Save to my night out'}
                      className={`p-2 rounded-lg transition-colors shrink-0 ${
                        isSaved
                          ? 'bg-rose-50 text-rose-600'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-violet-600 transition-colors line-clamp-1">
                    {spot.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-2">
                    {spot.subTitle} · {spot.area}
                  </p>

                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-150 text-[11px] font-medium text-slate-700 mb-3">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span className="line-clamp-1">Vibe: {spot.vibe}</span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {spot.description}
                  </p>

                  {/* Signature Cocktail / Showstopper Highlight */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 mb-3">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Wine className="w-3 h-3 text-violet-500" />
                        <span>Must-Try Cocktail / Perk</span>
                      </span>
                      <span className="text-violet-700 font-bold">
                        {spot.signatureCocktails[0]?.priceSgd}
                      </span>
                    </div>
                    <div className="font-semibold text-slate-800 text-xs line-clamp-1">
                      {spot.signatureCocktails[0]?.name}
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {spot.signatureCocktails[0]?.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Shelter & Timing Meta */}
                <div className="mt-auto px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-2 text-xs">
                  {/* Music & Hours */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-600 truncate flex items-center gap-1">
                      <Volume2 className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{spot.musicGenre}</span>
                    </span>
                    <span className="text-slate-700 font-semibold shrink-0 ml-2">
                      {spot.openingHours.split(',')[0]}
                    </span>
                  </div>

                  {/* Shelter & Transit */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-[11px] truncate">{spot.shelterLevel.split('(')[0]}</span>
                    </div>

                    <span className="text-slate-700 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                      <span>Full details</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Nighttime Haze Safety & Underground Nightlife Guide */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0 border border-violet-200">
            <Moon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Singapore Nightlife: Why Indoor & Subterranean Venues Rule During Haze
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              During Southeast Asian transboundary smoke events, cool evening air can cause an atmospheric temperature inversion, trapping fine PM2.5 particulates closer to ground level after sunset. Choosing fully enclosed speakeasies, basement jazz cellars, or high-altitude sealed lounges ensures an exceptional evening without irritating your respiratory tract.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Underground Speakeasies</span>
              <span className="text-[10px] bg-violet-100 text-violet-800 px-2 py-0.5 rounded font-semibold">
                Air-Tight
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Basement spots like <strong>28 HongKong Street</strong>, <strong>B28 Jazz</strong>, and <strong>The Dragon Chamber</strong> have dedicated internal air handling units and zero external breeze entry points.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Sealed High-Altitude Sky Bars</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                Double-Glazed
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Instead of open-air rooftop bars where smoke is exposed to wind, choose sealed indoor panoramic rooms like <strong>SKAI Bar</strong> (Level 70) and <strong>CÉ LA VI Indoor Lounge</strong> (Level 57).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>MRT Underpass Connectivity</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-semibold">
                Direct Transit
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Venues inside <strong>Marina Bay Sands</strong> (MARQUEE, CÉ LA VI), <strong>Bugis Parkview Square</strong> (ATLAS), and <strong>CHIJMES</strong> (Simply Live) connect directly to MRT stations via indoor air-conditioned walkways.
            </p>
          </div>
        </div>
      </section>

      {/* Nightspot Detail Modal */}
      {activeModalSpot && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveModalSpot(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white relative">
              <button
                onClick={() => setActiveModalSpot(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-violet-600 text-white flex items-center gap-1">
                  {getCategoryIcon(activeModalSpot.category)}
                  <span>{activeModalSpot.category}</span>
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">
                  {activeModalSpot.priceTier}
                </span>
                {activeModalSpot.awardOrBadge && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-violet-950/80 text-violet-300 border border-violet-600/50 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-violet-400 text-violet-400" />
                    <span>{activeModalSpot.awardOrBadge}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold pr-10">
                {activeModalSpot.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {activeModalSpot.subTitle} · {activeModalSpot.area}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Description & Vibe */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-violet-50 text-violet-900 text-xs font-semibold border border-violet-200/80 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                  <span>Ambiance: {activeModalSpot.vibe}</span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mt-1">
                  {activeModalSpot.description}
                </p>
              </div>

              {/* Haze & Indoor Shelter Intelligence */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-1.5 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Indoor Air Quality & Shelter: {activeModalSpot.shelterLevel}</span>
                </div>
                <p className="leading-relaxed">
                  {activeModalSpot.hazeSafetyNote}
                </p>
                {activeModalSpot.shelteredMrtAccess && (
                  <div className="pt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Train className="w-3 h-3" />
                    <span>Sheltered access from {activeModalSpot.nearestMrt}</span>
                  </div>
                )}
              </div>

              {/* Signature Cocktails / Bottle Service / Perks */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Wine className="w-4 h-4 text-violet-500" />
                  <span>Signature Cocktails & Highlights</span>
                </h3>
                <div className="space-y-2.5">
                  {activeModalSpot.signatureCocktails.map((cocktail, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{cocktail.name}</span>
                          {cocktail.isHighlight && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-violet-100 text-violet-800">
                              Must Try
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {cocktail.description}
                        </p>
                      </div>
                      <span className="font-bold text-sm text-violet-700 shrink-0">
                        {cocktail.priceSgd}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Operating Hours</span>
                  </div>
                  <p className="text-slate-600">{activeModalSpot.openingHours}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cover Charge / Min Spend</span>
                  </div>
                  <p className="text-slate-600">{activeModalSpot.coverCharge}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Shirt className="w-3.5 h-3.5 text-slate-500" />
                    <span>Dress Code</span>
                  </div>
                  <p className="text-slate-600 font-semibold">{activeModalSpot.dressCode}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Music Genre</span>
                  </div>
                  <p className="text-slate-600">{activeModalSpot.musicGenre}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reservation Advice</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{activeModalSpot.reservationAdvice}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Address & Transit</span>
                  </div>
                  <p className="text-slate-800 font-medium">{activeModalSpot.address}</p>
                  <p className="text-slate-500 text-[11px]">{activeModalSpot.nearestMrt}</p>
                </div>

                <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-200/80 space-y-1 sm:col-span-2">
                  <div className="font-bold text-violet-950 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                    <span>Insider Secret / Entry Instructions</span>
                  </div>
                  <p className="text-violet-900 text-xs leading-relaxed">{activeModalSpot.touristTip}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveSpot(activeModalSpot.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                    savedIds.includes(activeModalSpot.id)
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${savedIds.includes(activeModalSpot.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{savedIds.includes(activeModalSpot.id) ? 'Saved' : 'Save to Night Out'}</span>
                </button>

                <button
                  onClick={() => handleCopyShare(activeModalSpot)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeModalSpot.googleMapsQuery
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Maps / Get Directions</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Random Night Out Decider Modal */}
      {randomModalSpot && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setRandomModalSpot(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center mx-auto shadow-sm">
              <Shuffle className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-700 bg-violet-50 px-2.5 py-1 rounded-full border border-violet-200">
                Night Out Match
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {randomModalSpot.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {randomModalSpot.category} · {randomModalSpot.area}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 text-left space-y-2">
              <div>
                <span className="font-bold text-slate-800 block">Vibe:</span>
                <span className="text-violet-800 font-medium">
                  {randomModalSpot.vibe}
                </span>
              </div>
              <div>
                <span className="font-bold text-slate-800 block">Highlight Drink:</span>
                <span className="text-slate-700">
                  {randomModalSpot.signatureCocktails[0]?.name} ({randomModalSpot.signatureCocktails[0]?.priceSgd})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {randomModalSpot.signatureCocktails[0]?.description}
              </p>
              <div className="pt-1 text-[11px] text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{randomModalSpot.nearestMrt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSurpriseMe}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Match Another</span>
              </button>

              <button
                onClick={() => {
                  const target = randomModalSpot;
                  setRandomModalSpot(null);
                  setActiveModalSpot(target);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
              >
                View Full Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
