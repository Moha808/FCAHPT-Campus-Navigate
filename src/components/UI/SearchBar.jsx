import React, { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ locations, onSelectLocation }) => {
  const [query, setQuery]       = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filtered = locations.filter(loc =>
    loc.name.toLowerCase().includes(query.toLowerCase()) ||
    loc.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="relative w-full">
      {/* Input pill */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center px-4 py-3 gap-3">
        <Search className="w-5 h-5 text-gray-400 shrink-0" />
        <input
          type="text"
          placeholder="Search buildings, hostels, clinics..."
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 150)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      <AnimatePresence>
        {isFocused && query && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden max-h-64 overflow-y-auto z-50"
          >
            {filtered.map(loc => (
              <button
                key={loc.id}
                onMouseDown={() => handleSelect(loc)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{loc.name}</p>
                  <p className="text-xs text-gray-400 capitalize">{loc.category}</p>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
