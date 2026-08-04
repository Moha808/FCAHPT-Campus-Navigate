import React, { useState } from 'react';
import { Search, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchBar = ({ locations, onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredLocations = locations.filter(loc => 
    loc.name.toLowerCase().includes(query.toLowerCase()) || 
    loc.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (loc) => {
    onSelectLocation(loc);
    setQuery('');
    setIsFocused(false);
  };

  return (
    <div className="absolute top-4 left-4 right-4 z-[1000]">
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 flex items-center px-4 py-3"
      >
        <Search className="w-5 h-5 text-gray-400 mr-3" />
        <input 
          type="text" 
          placeholder="Search for buildings, hostels, clinics..." 
          className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        {query && (
          <button onClick={() => setQuery('')} className="p-1 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {(isFocused && query && filteredLocations.length > 0) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-60 overflow-y-auto"
          >
            {filteredLocations.map(loc => (
              <div 
                key={loc.id}
                onClick={() => handleSelect(loc)}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center"
              >
                <div className="w-8 h-8 rounded-full bg-brand-50 flex items-center justify-center mr-3">
                  <MapPin className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800">{loc.name}</h4>
                  <p className="text-xs text-gray-500 capitalize">{loc.category}</p>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
