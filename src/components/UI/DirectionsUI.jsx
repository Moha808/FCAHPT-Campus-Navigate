import React, { useState, useEffect } from 'react';
import { X, MapPin, ArrowDownUp, Navigation, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DirectionsUI = ({ locations, onClose, initialDestination, onRouteUpdate }) => {
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState(initialDestination ? initialDestination.name : '');
  
  const [fromLocation, setFromLocation] = useState(null);
  const [toLocation, setToLocation] = useState(initialDestination || null);
  
  const [activeInput, setActiveInput] = useState(null); // 'from' or 'to'

  const [isLocating, setIsLocating] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLocation = {
          id: 'current-user-location',
          name: 'My Current Location',
          category: 'user-location',
          color: 'bg-blue-600',
          coordinates: [position.coords.latitude, position.coords.longitude]
        };
        handleSelect(userLocation, activeInput);
      },
      (error) => {
        setIsLocating(false);
        alert('Unable to retrieve your location. Please check your permissions.');
        console.error('Error getting location:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const filteredLocations = (query) => {
    if (!query) return locations;
    return locations.filter(loc => loc.name.toLowerCase().includes(query.toLowerCase()));
  };

  const handleSelect = (loc, type) => {
    if (type === 'from') {
      setFromLocation(loc);
      setFromQuery(loc.name);
    } else {
      setToLocation(loc);
      setToQuery(loc.name);
    }
    setActiveInput(null);
  };

  const swapLocations = () => {
    const tempLoc = fromLocation;
    const tempQuery = fromQuery;
    
    setFromLocation(toLocation);
    setFromQuery(toQuery);
    
    setToLocation(tempLoc);
    setToQuery(tempQuery);
  };

  // Notify parent whenever both are selected
  useEffect(() => {
    if (fromLocation && toLocation) {
      onRouteUpdate(fromLocation, toLocation);
    }
  }, [fromLocation, toLocation]);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      className="absolute top-4 left-4 right-4 z-[2000] sm:w-[450px] sm:left-1/2 sm:-translate-x-1/2 bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
    >
      <div className="p-4 bg-brand-600 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center text-white font-bold">
          <Navigation className="w-5 h-5 mr-2 shrink-0 fill-white" />
          Directions
        </div>
        <button onClick={onClose} className="p-2 hover:bg-brand-700 rounded-full transition-colors text-white shrink-0">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 relative bg-gray-50/50">
        <div className="flex relative">
          {/* Path graphic */}
          <div className="flex flex-col items-center justify-center mr-3 ml-1">
            <div className="w-3 h-3 border-2 border-brand-500 rounded-full"></div>
            <div className="w-0.5 h-10 border-l-2 border-dashed border-gray-300 my-1"></div>
            <MapPin className="w-4 h-4 text-brand-600" />
          </div>
          
          <div className="flex-1 space-y-3">
            {/* From Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Choose starting point..." 
                value={fromQuery}
                onChange={(e) => {
                  setFromQuery(e.target.value);
                  setFromLocation(null);
                }}
                onFocus={() => setActiveInput('from')}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>
            
            {/* To Input */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Choose destination..." 
                value={toQuery}
                onChange={(e) => {
                  setToQuery(e.target.value);
                  setToLocation(null);
                }}
                onFocus={() => setActiveInput('to')}
                className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-sm"
              />
            </div>
          </div>
          
          {/* Swap Button */}
          <button 
            onClick={swapLocations}
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 transition-colors shadow-sm"
          >
            <ArrowDownUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Autocomplete Dropdown */}
      <AnimatePresence>
        {activeInput && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 max-h-[40vh] overflow-y-auto bg-white"
          >
            <div className="p-2">
              {/* Use Current Location Button */}
              {((activeInput === 'from' && !fromQuery) || (activeInput === 'to' && !toQuery)) && (
                <button
                  onClick={handleUseCurrentLocation}
                  disabled={isLocating}
                  className="w-full text-left p-3 rounded-xl hover:bg-blue-50 transition-colors flex items-center mb-2 border border-blue-100 bg-blue-50/30"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0 mr-3 shadow-sm">
                    {isLocating ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Navigation className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="font-bold text-blue-700 text-sm">
                      {isLocating ? 'Locating...' : 'Use My Current Location'}
                    </div>
                  </div>
                </button>
              )}

              {filteredLocations(activeInput === 'from' ? fromQuery : toQuery).map(loc => (
                <button
                  key={loc.id}
                  onClick={() => handleSelect(loc, activeInput)}
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center"
                >
                  <div className={`w-8 h-8 rounded-full ${loc.color || 'bg-brand-500'} flex items-center justify-center text-white shrink-0 mr-3 shadow-sm`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{loc.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{loc.category}</div>
                  </div>
                </button>
              ))}
              {filteredLocations(activeInput === 'from' ? fromQuery : toQuery).length === 0 && (
                <div className="p-4 text-center text-gray-500 text-sm">
                  No locations found.
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DirectionsUI;
