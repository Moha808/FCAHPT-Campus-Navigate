import React, { useState } from 'react';
import { MapPin, ChevronRight, Image as ImageIcon, GraduationCap, Building2, Home, Stethoscope, Landmark } from 'lucide-react';
import { categories } from '../../data/locations';

// Map category id → icon
const categoryIcons = {
  academic: GraduationCap,
  admin: Building2,
  hostel: Home,
  clinic: Stethoscope,
  facility: Landmark,
};

// Map category id → color scheme
const categoryColors = {
  academic: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200', activeBg: '#3b82f6' },
  admin:    { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-50', border: 'border-purple-200', activeBg: '#a855f7' },
  hostel:   { bg: 'bg-orange-500', text: 'text-orange-600', light: 'bg-orange-50', border: 'border-orange-200', activeBg: '#f97316' },
  clinic:   { bg: 'bg-green-500', text: 'text-green-600', light: 'bg-green-50', border: 'border-green-200', activeBg: '#22c55e' },
  facility: { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-50', border: 'border-yellow-200', activeBg: '#eab308' },
};

const LocationCard = ({ loc, onSelect }) => {
  const [imgError, setImgError] = useState(false);
  const Icon = categoryIcons[loc.category] || Landmark;
  const colors = categoryColors[loc.category] || categoryColors.facility;

  return (
    <button
      onClick={() => onSelect(loc)}
      className="w-full text-left group flex items-center bg-white/90 backdrop-blur-md rounded-[20px] p-3 shadow-sm border border-gray-100/80 hover:shadow-xl hover:shadow-brand-500/10 hover:border-brand-200 transition-all duration-300 active:scale-[0.98]"
    >
      <div className="w-[72px] h-[72px] rounded-[14px] overflow-hidden shrink-0 relative bg-brand-50 flex items-center justify-center shadow-inner">
        {!imgError && loc.image ? (
          <img
            src={loc.image}
            alt={loc.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
        ) : (
          <ImageIcon className="w-6 h-6 text-brand-300" />
        )}
      </div>

      <div className="ml-4 flex-1 min-w-0">
        <h3 className="font-bold text-gray-800 text-[16px] leading-tight mb-2 group-hover:text-brand-600 transition-colors duration-300 truncate">
          {loc.name}
        </h3>
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${colors.light} ${colors.text}`}>
          <Icon className="w-3 h-3" />
          {loc.category}
        </div>
      </div>

      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-brand-50 group-hover:text-brand-600 text-gray-300 transition-all duration-300 shrink-0 shadow-sm border border-gray-100 group-hover:border-brand-100 group-hover:-translate-x-1 ml-2">
        <ChevronRight className="w-5 h-5" />
      </div>
    </button>
  );
};

const LocationList = ({ locations, onSelect }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? locations
    : locations.filter(l => l.category === activeFilter);

  return (
    <div className="px-4 pb-8 pt-2 flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col mb-4 px-2">
        <h2 className="text-[28px] font-extrabold bg-gradient-to-r from-gray-900 via-brand-800 to-brand-500 bg-clip-text text-transparent tracking-tight">
          Campus Explore
        </h2>
        <div className="w-12 h-1.5 bg-brand-500 rounded-full mt-2"></div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-3 px-2 shrink-0" style={{ scrollbarWidth: 'none' }}>
        <button
          onClick={() => setActiveFilter('all')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200 shrink-0 ${
            activeFilter === 'all'
              ? 'bg-gray-900 text-white border-gray-900 shadow-lg scale-[1.03]'
              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          All Places
        </button>

        {categories.map(cat => {
          const Icon = categoryIcons[cat.id] || Landmark;
          const isActive = activeFilter === cat.id;
          const colors = categoryColors[cat.id] || categoryColors.facility;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              style={isActive ? { backgroundColor: colors.activeBg } : {}}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200 shrink-0 ${
                isActive
                  ? 'text-white border-transparent shadow-lg scale-[1.03]'
                  : `bg-white ${colors.text} ${colors.border}`
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Location Cards */}
      <div className="space-y-3 overflow-y-auto flex-1 px-2 pt-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <MapPin className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-semibold text-sm">No locations in this category</p>
          </div>
        ) : (
          filtered.map((loc) => (
            <LocationCard key={loc.id} loc={loc} onSelect={onSelect} />
          ))
        )}
      </div>
    </div>
  );
};

export default LocationList;
