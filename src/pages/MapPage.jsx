import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CampusMap from '../components/Map/CampusMap';
import SearchBar from '../components/UI/SearchBar';
import BottomSheet from '../components/UI/BottomSheet';
import LocationDetails from '../components/UI/LocationDetails';
import DirectionsUI from '../components/UI/DirectionsUI';
import { locations, categories } from '../data/locations';
import {
  GraduationCap, Building2, Stethoscope, Home, Landmark,
  Navigation, MapPin, X
} from 'lucide-react';

// Category icon map
const catIcons = {
  academic: GraduationCap,
  admin:    Building2,
  clinic:   Stethoscope,
  hostel:   Home,
  facility: Landmark,
};

// Category colour map (for active chip bg)
const catColors = {
  academic: '#3b82f6',
  admin:    '#a855f7',
  clinic:   '#22c55e',
  hostel:   '#f97316',
  facility: '#eab308',
};

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeStart, setRouteStart]             = useState(null);
  const [routeEnd, setRouteEnd]                 = useState(null);
  const [isRoutingMode, setIsRoutingMode]       = useState(false);
  const [routeDestination, setRouteDestination] = useState(null);
  const [activeCategory, setActiveCategory]     = useState(null); // filter
  const [isLocating, setIsLocating]             = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setRouteStart(null);
    setRouteEnd(null);
  };

  const handleGetDirections = (location) => {
    setRouteDestination(location);
    setIsRoutingMode(true);
    setSelectedLocation(null);
    setRouteStart(null);
    setRouteEnd(location);
  };

  const handleRouteUpdate = (fromLoc, toLoc) => {
    setRouteStart(fromLoc);
    setRouteEnd(toLoc);
  };

  const cancelRouting = () => {
    setIsRoutingMode(false);
    setRouteStart(null);
    setRouteEnd(null);
    setRouteDestination(null);
  };

  // Filter visible pins by active category
  const visibleLocations = activeCategory
    ? locations.filter(l => l.category === activeCategory)
    : locations;

  // My Location button handler
  const handleMyLocation = () => {
    if (!navigator.geolocation) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        // Pan map – we inject a fake "user" location object
        handleLocationSelect({
          id: '__user_location__',
          name: 'My Location',
          category: 'facility',
          coordinates: [pos.coords.latitude, pos.coords.longitude],
          description: 'Your current GPS location.',
          image: null,
        });
      },
      () => setIsLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">

      {/* ── Full-screen Map ─────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <CampusMap
          locations={visibleLocations}
          selectedLocation={selectedLocation}
          onMarkerClick={handleLocationSelect}
          routeStart={routeStart}
          routeEnd={routeEnd}
        />
      </div>

      {/* ── Top overlay: Search + Category chips ─────────────────────────── */}
      <AnimatePresence>
        {!isRoutingMode && !selectedLocation && (
          <motion.div
            key="top-ui"
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 z-[1000] pt-4 px-4 flex flex-col gap-3"
          >
            {/* Search bar */}
            <SearchBar
              locations={locations}
              onSelectLocation={handleLocationSelect}
            />

            {/* Category filter chips — like Google Maps */}
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {/* All chip */}
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-md border transition-all shrink-0 ${
                  !activeCategory
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                All Places
              </button>

              {categories.map(cat => {
                const Icon = catIcons[cat.id] || Landmark;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(isActive ? null : cat.id)}
                    style={isActive ? { backgroundColor: catColors[cat.id] } : {}}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap shadow-md border transition-all shrink-0 ${
                      isActive
                        ? 'text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Active filter indicator banner */}
            {activeCategory && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 self-start bg-white rounded-full px-3 py-1.5 shadow text-xs font-semibold text-gray-700 border border-gray-100"
              >
                <span>
                  Showing {visibleLocations.length} {activeCategory} location{visibleLocations.length !== 1 ? 's' : ''}
                </span>
                <button onClick={() => setActiveCategory(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── My Location FAB (bottom-right, above map toggle) ─────────────── */}
      {!isRoutingMode && !selectedLocation && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleMyLocation}
          disabled={isLocating}
          className="absolute bottom-24 right-4 z-[500] w-12 h-12 bg-white rounded-full shadow-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 active:scale-90 transition-all"
          title="My Location"
        >
          {isLocating
            ? <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            : <Navigation className="w-5 h-5 text-brand-600" />
          }
        </motion.button>
      )}

      {/* ── Directions UI ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isRoutingMode && (
          <DirectionsUI
            locations={locations}
            onClose={cancelRouting}
            initialDestination={routeDestination}
            onRouteUpdate={handleRouteUpdate}
          />
        )}
      </AnimatePresence>

      {/* ── Location Detail Bottom Sheet ─────────────────────────────────── */}
      <BottomSheet isOpen={!!selectedLocation}>
        <AnimatePresence mode="wait">
          {selectedLocation && (
            <motion.div
              key={selectedLocation.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <LocationDetails
                location={selectedLocation}
                onBack={() => setSelectedLocation(null)}
                onGetDirections={handleGetDirections}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </BottomSheet>

    </div>
  );
};

export default MapPage;
