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
  CheckCircle2,
  Share2,
  Utensils,
  Soup,
  Pizza,
  Fish,
  Flame,
  Coffee,
  BookmarkCheck,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';
import { Eatery, CuisineType, PriceTier, DietaryTag } from '../types/eatery';
import { SINGAPORE_EATERIES, CUISINE_CATEGORIES } from '../data/eateriesData';
import { SingaporeRegion } from '../types/haze';

interface SingaporeEateriesGuideProps {
  currentPsi?: number;
  onNavigateToTab?: (tab: string) => void;
}

export const SingaporeEateriesGuide: React.FC<SingaporeEateriesGuideProps> = ({
  currentPsi = 68,
}) => {
  const [selectedCuisine, setSelectedCuisine] = useState<CuisineType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<SingaporeRegion | 'all'>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceTier | 'all'>('all');
  const [filterShelteredOnly, setFilterShelteredOnly] = useState<boolean>(false);
  const [filterAirConOnly, setFilterAirConOnly] = useState<boolean>(false);
  const [filterMichelinOnly, setFilterMichelinOnly] = useState<boolean>(false);
  const [filterDietary, setFilterDietary] = useState<DietaryTag | 'all'>('all');
  const [showSavedOnly, setShowSavedOnly] = useState<boolean>(false);
  const [savedIds, setSavedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('captain_haze_saved_eateries');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeModalEatery, setActiveModalEatery] = useState<Eatery | null>(null);
  const [randomModalEatery, setRandomModalEatery] = useState<Eatery | null>(null);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Sync saved to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('captain_haze_saved_eateries', JSON.stringify(savedIds));
    } catch (err) {
      console.error('Failed to save to localStorage:', err);
    }
  }, [savedIds]);

  const toggleSaveEatery = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filter logic
  const filteredEateries = useMemo(() => {
    return SINGAPORE_EATERIES.filter((eatery) => {
      // Saved filter
      if (showSavedOnly && !savedIds.includes(eatery.id)) {
        return false;
      }

      // Cuisine filter
      if (selectedCuisine !== 'All' && eatery.cuisine !== selectedCuisine) {
        return false;
      }

      // Region filter
      if (selectedRegion !== 'all' && eatery.region !== selectedRegion) {
        return false;
      }

      // Price filter
      if (selectedPrice !== 'all' && eatery.priceTier !== selectedPrice) {
        return false;
      }

      // Air conditioning filter
      if (filterAirConOnly && eatery.shelterLevel === 'High-Ceiling Sheltered & Ventilated') {
        return false;
      }

      // Sheltered MRT filter
      if (filterShelteredOnly && !eatery.shelteredMrtAccess) {
        return false;
      }

      // Michelin filter
      if (filterMichelinOnly && !eatery.awardOrBadge) {
        return false;
      }

      // Dietary filter
      if (filterDietary !== 'all') {
        if (!eatery.dietaryTags.includes(filterDietary)) {
          return false;
        }
      }

      // Search query filter (matches name, dishes, area, address, cuisine)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = eatery.name.toLowerCase().includes(query);
        const matchesCuisine = eatery.cuisine.toLowerCase().includes(query);
        const matchesArea = eatery.area.toLowerCase().includes(query);
        const matchesMrt = eatery.nearestMrt.toLowerCase().includes(query);
        const matchesDishes = eatery.signatureDishes.some(
          (d) =>
            d.name.toLowerCase().includes(query) ||
            d.description.toLowerCase().includes(query)
        );
        const matchesDesc = eatery.description.toLowerCase().includes(query);

        if (!matchesName && !matchesCuisine && !matchesArea && !matchesMrt && !matchesDishes && !matchesDesc) {
          return false;
        }
      }

      return true;
    });
  }, [
    selectedCuisine,
    selectedRegion,
    selectedPrice,
    filterShelteredOnly,
    filterAirConOnly,
    filterMichelinOnly,
    filterDietary,
    searchQuery,
    showSavedOnly,
    savedIds,
  ]);

  const handleSurpriseMe = () => {
    const pool = filteredEateries.length > 0 ? filteredEateries : SINGAPORE_EATERIES;
    const randomIndex = Math.floor(Math.random() * pool.length);
    setRandomModalEatery(pool[randomIndex]);
  };

  const handleCopyShare = (eatery: Eatery) => {
    const text = `Check out ${eatery.name} in Singapore (${eatery.cuisine} cuisine, ${eatery.area})! Nearest MRT: ${eatery.nearestMrt}. Must-try: ${eatery.signatureDishes[0]?.name}.`;
    navigator.clipboard?.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const getCuisineIcon = (cuisine: CuisineType | 'All') => {
    switch (cuisine) {
      case 'Singapore Local':
        return <Soup className="w-4 h-4" />;
      case 'Italian':
        return <Pizza className="w-4 h-4" />;
      case 'Japanese':
        return <Fish className="w-4 h-4" />;
      case 'Korean':
        return <Flame className="w-4 h-4" />;
      case 'Chinese':
        return <Utensils className="w-4 h-4" />;
      case 'Malay':
        return <Coffee className="w-4 h-4" />;
      case 'Indian':
        return <Sparkles className="w-4 h-4" />;
      default:
        return <Compass className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Hero & Context Banner */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden border border-slate-700">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wide border border-amber-500/30">
            <Utensils className="w-3.5 h-3.5" />
            <span>Singapore Culinary Directory & Haze-Safe Dining</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Discover the Best Eateries Across Singapore
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Curated dining recommendations across <span className="text-white font-medium">Italian, Japanese, Korean, Singapore Local Delicacies, Chinese, Malay, and Indian</span> cuisines. Every eatery includes verified indoor air filtration details and sheltered MRT connectivity so you can enjoy world-class meals comfortably, rain or haze.
          </p>

          {/* Current Haze Context Callout */}
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
            <div className={`px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium ${
              currentPsi > 100
                ? 'bg-amber-900/60 border border-amber-500/40 text-amber-200'
                : 'bg-slate-800/80 border border-slate-600 text-slate-300'
            }`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>
                {currentPsi > 100
                  ? `Active PSI is ${currentPsi} (Elevated): Recommended to prioritize HEPA-Filtered Malls & Sheltered MRT entries.`
                  : `Air Quality is currently benign (PSI ${currentPsi}): Both indoor halls and open dining pavilions are pleasant.`}
              </span>
            </div>

            <button
              onClick={handleSurpriseMe}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition-all shadow-sm active:scale-95"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Can't Decide? Pick for Me</span>
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
              placeholder="Search dishes (e.g. Laksa, Peking Duck, Wagyu, Briyani, Truffle Pizza), restaurants, or MRT..."
              className="w-full pl-11 pr-10 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent text-sm bg-slate-50 placeholder:text-slate-400"
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
              <span className="hidden sm:inline">Surprise Me</span>
            </button>
          </div>
        </div>

        {/* Cuisine Selection Tabs */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5 block">
            Select Cuisine ({CUISINE_CATEGORIES.length - 1} Authenticated Traditions)
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {CUISINE_CATEGORIES.map((cat) => {
              const isSelected = selectedCuisine === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCuisine(cat.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className={isSelected ? 'text-amber-400' : 'text-slate-500'}>
                    {getCuisineIcon(cat.id)}
                  </span>
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isSelected ? 'bg-slate-700 text-amber-300' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Filter Bar (Region, Price, Shelter, Dietary, Michelin) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs text-slate-600">
          <div className="flex items-center gap-1.5 font-medium text-slate-500 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Refine:</span>
          </div>

          {/* Region Dropdown */}
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as SingaporeRegion | 'all')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Regions (Singapore)</option>
            <option value="central">Central (Orchard, Chinatown, CBD)</option>
            <option value="south">South (Sentosa, Dempsey)</option>
            <option value="east">East (Katong, Jewel Changi)</option>
            <option value="west">West (Hillview, Jurong)</option>
            <option value="north">North (Woodlands, Yishun)</option>
          </select>

          {/* Price Tier Dropdown */}
          <select
            value={selectedPrice}
            onChange={(e) => setSelectedPrice(e.target.value as PriceTier | 'all')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Price Tiers</option>
            <option value="$">$ (Hawker & Budget under $15)</option>
            <option value="$$">$$ (Casual Dining $15 - $35)</option>
            <option value="$$$">$$$ (Upscale $35 - $90)</option>
            <option value="$$$$">$$$$ (Fine Dining $90+)</option>
          </select>

          {/* Dietary Filter */}
          <select
            value={filterDietary}
            onChange={(e) => setFilterDietary(e.target.value as DietaryTag | 'all')}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-medium text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="all">All Dietary Preferences</option>
            <option value="Halal-Certified">Halal-Certified</option>
            <option value="Vegetarian-Friendly">Vegetarian-Friendly</option>
            <option value="Pork-Free">Pork-Free</option>
          </select>

          {/* Haze Air Con Toggle */}
          <button
            onClick={() => setFilterAirConOnly(!filterAirConOnly)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-medium transition-colors ${
              filterAirConOnly
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Air-Conditioned Only (Haze-Safe)</span>
          </button>

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

          {/* Michelin Award Toggle */}
          <button
            onClick={() => setFilterMichelinOnly(!filterMichelinOnly)}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-medium transition-colors ${
              filterMichelinOnly
                ? 'bg-amber-50 border-amber-300 text-amber-800'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
            <span>Michelin / Heritage Awarded</span>
          </button>

          {/* Reset Filters */}
          {(selectedCuisine !== 'All' ||
            selectedRegion !== 'all' ||
            selectedPrice !== 'all' ||
            filterShelteredOnly ||
            filterAirConOnly ||
            filterMichelinOnly ||
            filterDietary !== 'all' ||
            searchQuery ||
            showSavedOnly) && (
            <button
              onClick={() => {
                setSelectedCuisine('All');
                setSelectedRegion('all');
                setSelectedPrice('all');
                setFilterShelteredOnly(false);
                setFilterAirConOnly(false);
                setFilterMichelinOnly(false);
                setFilterDietary('all');
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
          Showing <span className="font-bold text-slate-900">{filteredEateries.length}</span> verified eateries
          {selectedCuisine !== 'All' && <span> in <strong className="text-slate-900">{selectedCuisine}</strong></span>}
          {selectedRegion !== 'all' && <span> ({selectedRegion.toUpperCase()} Region)</span>}
        </div>
        <div className="text-xs text-slate-500">
          Tip: Tap any card to view signature dishes, prices & MRT exits
        </div>
      </div>

      {/* Eateries Grid */}
      {filteredEateries.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No eateries match your selected filters</h3>
          <p className="text-sm text-slate-500">
            Try resetting some filters or searching for another dish or cuisine.
          </p>
          <button
            onClick={() => {
              setSelectedCuisine('All');
              setSelectedRegion('all');
              setSelectedPrice('all');
              setFilterShelteredOnly(false);
              setFilterAirConOnly(false);
              setFilterMichelinOnly(false);
              setFilterDietary('all');
              setSearchQuery('');
              setShowSavedOnly(false);
            }}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEateries.map((eatery) => {
            const isSaved = savedIds.includes(eatery.id);
            return (
              <div
                key={eatery.id}
                onClick={() => setActiveModalEatery(eatery)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col overflow-hidden relative"
              >
                {/* Top Badge Strip */}
                <div className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-900 text-white">
                        {eatery.cuisine}
                      </span>
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {eatery.priceTier} · {eatery.priceEstimate}
                      </span>
                      {eatery.awardOrBadge && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>{eatery.awardOrBadge}</span>
                        </span>
                      )}
                    </div>

                    {/* Bookmark Button */}
                    <button
                      onClick={(e) => toggleSaveEatery(eatery.id, e)}
                      title={isSaved ? 'Remove from saved' : 'Save to my food trail'}
                      className={`p-2 rounded-lg transition-colors shrink-0 ${
                        isSaved
                          ? 'bg-rose-50 text-rose-600'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1">
                    {eatery.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mb-3">
                    {eatery.subCategory} · {eatery.area}
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                    {eatery.description}
                  </p>

                  {/* Must-Try Signature Dish Box */}
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 mb-3">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Signature Must-Try</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 line-clamp-1">
                        {eatery.signatureDishes[0]?.name}
                      </span>
                      <span className="font-bold text-amber-600 shrink-0 ml-2">
                        {eatery.signatureDishes[0]?.priceSgd}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {eatery.signatureDishes[0]?.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Shelter & Transit Meta */}
                <div className="mt-auto px-5 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col gap-2 text-xs">
                  {/* Air filtration indicator */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-medium text-slate-700">
                      <ShieldCheck className={`w-3.5 h-3.5 shrink-0 ${
                        eatery.shelterLevel === 'HEPA-Filtered Mall'
                          ? 'text-emerald-600'
                          : eatery.shelterLevel === 'Fully Enclosed Air-Conditioned'
                          ? 'text-cyan-600'
                          : 'text-amber-600'
                      }`} />
                      <span className="text-[11px] truncate">{eatery.shelterLevel}</span>
                    </div>

                    {eatery.shelteredMrtAccess && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        <Train className="w-3 h-3" />
                        <span>Sheltered Link</span>
                      </span>
                    )}
                  </div>

                  {/* Nearest MRT */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{eatery.nearestMrt}</span>
                    </span>
                    <span className="text-slate-700 font-semibold flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                      <span>View details</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Singapore Haze-Safe Dining Underground Concourses Guide */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Singapore Haze-Safe Dining: Underground & Sheltered Food Hubs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Singapore possesses the world's most extensive climate-controlled underground pedestrian mall network. During severe transboundary smoke haze, tourists can hop between hundreds of eateries without stepping outdoors into hazy air.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>City Hall & Marina Centre Tunnel</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                100% Sheltered
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>CityLink Mall</strong> directly connects <strong>City Hall MRT</strong> (NS25/EW13) to <strong>Esplanade MRT</strong>, <strong>Suntec City</strong>, and <strong>Marina Square</strong>. Over 180 eateries with full central air filtration.
            </p>
            <div className="text-[11px] text-slate-500 font-medium">
              Featured: Bornga Suntec, National Kitchen (via Gallery underpass), Din Tai Fung.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Orchard Road Underground Spine</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                HEPA Malls
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Walk seamlessly underground from <strong>Orchard MRT</strong> (ION Orchard) through <strong>Wisma Atria</strong>, <strong>Ngee Ann City (Takashimaya)</strong>, and underpasses to <strong>Paragon</strong>.
            </p>
            <div className="text-[11px] text-slate-500 font-medium">
              Featured: sen-ryo (ION), Din Tai Fung (Paragon), Crystal Jade Golden Palace.
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="font-bold text-slate-900 flex items-center justify-between">
              <span>Jewel Changi Climate Biodome</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                Filtered Biodome
              </span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Directly linked to <strong>Changi Airport MRT</strong> and Terminals 1, 2, and 3 via indoor bridges. 5 storeys of dining facing the world's tallest indoor waterfall with ultra-pure air filtration.
            </p>
            <div className="text-[11px] text-slate-500 font-medium">
              Featured: Tsuta Ramen, JUMBO Seafood, Tim Ho Wan, Shake Shack.
            </div>
          </div>
        </div>
      </section>

      {/* Eatery Detail Modal */}
      {activeModalEatery && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveModalEatery(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white relative">
              <button
                onClick={() => setActiveModalEatery(null)}
                className="absolute top-5 right-5 p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-slate-950">
                  {activeModalEatery.cuisine}
                </span>
                <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">
                  {activeModalEatery.priceTier} ({activeModalEatery.priceEstimate})
                </span>
                {activeModalEatery.awardOrBadge && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-600/50 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{activeModalEatery.awardOrBadge}</span>
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold pr-10">
                {activeModalEatery.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {activeModalEatery.subCategory} · {activeModalEatery.area}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Description */}
              <p className="text-sm text-slate-700 leading-relaxed">
                {activeModalEatery.description}
              </p>

              {/* Haze & Indoor Shelter Intelligence */}
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200/80 space-y-1.5 text-xs text-emerald-950">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Indoor Air Quality & Shelter Status: {activeModalEatery.shelterLevel}</span>
                </div>
                <p className="leading-relaxed">
                  {activeModalEatery.indoorEnvironmentNote}
                </p>
                {activeModalEatery.shelteredMrtAccess && (
                  <div className="pt-1 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                    <Train className="w-3 h-3" />
                    <span>Direct underground/sheltered link from {activeModalEatery.nearestMrt}</span>
                  </div>
                )}
              </div>

              {/* Signature Dishes Menu */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Signature Must-Try Dishes</span>
                </h3>
                <div className="space-y-2.5">
                  {activeModalEatery.signatureDishes.map((dish, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-900">{dish.name}</span>
                          {dish.isMustTry && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                              Chef Pick
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {dish.description}
                        </p>
                      </div>
                      <span className="font-bold text-sm text-amber-600 shrink-0">
                        {dish.priceSgd}
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
                    <span>Opening Hours</span>
                  </div>
                  <p className="text-slate-600">{activeModalEatery.openingHours}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                    <span>Reservation Advice</span>
                  </div>
                  <p className="text-slate-600">{activeModalEatery.reservationAdvice}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 sm:col-span-2">
                  <div className="font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>Location & Nearest MRT</span>
                  </div>
                  <p className="text-slate-700 font-medium">{activeModalEatery.address}</p>
                  <p className="text-slate-500 text-[11px]">{activeModalEatery.nearestMrt}</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-1 sm:col-span-2">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Tourist Insider Tip</span>
                  </div>
                  <p className="text-amber-800 text-xs leading-relaxed">{activeModalEatery.touristTip}</p>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSaveEatery(activeModalEatery.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-colors ${
                    savedIds.includes(activeModalEatery.id)
                      ? 'bg-rose-50 border-rose-300 text-rose-700'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${savedIds.includes(activeModalEatery.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>{savedIds.includes(activeModalEatery.id) ? 'Saved' : 'Save to Trail'}</span>
                </button>

                <button
                  onClick={() => handleCopyShare(activeModalEatery)}
                  className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    activeModalEatery.googleMapsQuery
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

      {/* Random Decider Modal */}
      {randomModalEatery && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setRandomModalEatery(null)}
        >
          <div
            className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <Shuffle className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                Random Foodie Pick
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                {randomModalEatery.name}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {randomModalEatery.cuisine} Cuisine · {randomModalEatery.area}
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-600 border border-slate-200 text-left space-y-2">
              <div>
                <span className="font-bold text-slate-800 block">Must-Try:</span>
                <span className="text-amber-700 font-medium">
                  {randomModalEatery.signatureDishes[0]?.name} ({randomModalEatery.signatureDishes[0]?.priceSgd})
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {randomModalEatery.signatureDishes[0]?.description}
              </p>
              <div className="pt-1 text-[11px] text-slate-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{randomModalEatery.nearestMrt}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSurpriseMe}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>Pick Another</span>
              </button>

              <button
                onClick={() => {
                  const target = randomModalEatery;
                  setRandomModalEatery(null);
                  setActiveModalEatery(target);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors shadow-sm"
              >
                View Full Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
