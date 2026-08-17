import React, { useState } from 'react';
import { Search, X, MapPin, GraduationCap, Building2, Stethoscope, Home, Landmark } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const catIcon = { academic: GraduationCap, admin: Building2, clinic: Stethoscope, hostel: Home, facility: Landmark };
const catColor = { academic: 'bg-blue-500', admin: 'bg-purple-500', clinic: 'bg-green-500', hostel: 'bg-orange-500', facility: 'bg-yellow-500' };

const SearchBar = ({ locations, onSelectLocation }) => {
  const [query, setQuery]           = useState('');
  const [isFocused, setIsFocused]   = useState(false);

  const filtered = query
    ? locations.filter(loc =>
        loc.name.toLowerCase().includes(query.toLowerCase()) ||
        loc.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="relative w-full">
      {/* Input */}
      <div className={`bg-white rounded-2xl shadow-lg flex items-center px-4 py-3 gap-3 border transition-all duration-200 ${isFocused ? 'border-brand-400 shadow-brand-100 shadow-xl' : 'border-gray-100'}`}>
        <Search className={`w-5 h-5 shrink-0 transition-colors ${isFocused ? 'text-brand-500' : 'text-gray-400'}`} />
        <input
          type="text"
          placeholder="Search buildings, hostels, clinics..."
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm font-medium"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />
        {query
          ? (
            <button onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          ) : (
            <div className="shrink-0 px-2 py-0.5 bg-gray-100 rounded-lg">
              <span className="text-[10px] font-black text-gray-400 tracking-wide">FCAHPT</span>
            </div>
          )
        }
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isFocused && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-72 overflow-y-auto z-50"
          >
            <div className="px-3 py-2 border-b border-gray-50">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            {filtered.map(loc => {
              const Icon = catIcon[loc.category] || MapPin;
              const bg   = catColor[loc.category] || 'bg-gray-400';
              return (
                <button
                  key={loc.id}
                  onMouseDown={() => handleSelect(loc)}
                  className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 group-hover:text-brand-600 transition-colors truncate">{loc.name}</p>
                    <p className="text-xs text-gray-400 capitalize">{loc.category}</p>
                  </div>
                  <MapPin className="w-3.5 h-3.5 text-gray-300 group-hover:text-brand-400 transition-colors shrink-0" />
                </button>
              );
            })}
          </motion.div>
        )}
        {isFocused && query && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-8 text-center z-50"
          >
            <MapPin className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-500">No results for "<span className="text-gray-700">{query}</span>"</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
