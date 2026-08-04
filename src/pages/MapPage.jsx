import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CampusMap from '../components/Map/CampusMap';
import SearchBar from '../components/UI/SearchBar';
import BottomSheet from '../components/UI/BottomSheet';
import LocationList from '../components/UI/LocationList';
import LocationDetails from '../components/UI/LocationDetails';
import DirectionsUI from '../components/UI/DirectionsUI';
import { locations } from '../data/locations';

const MapPage = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [routeStart, setRouteStart] = useState(null);
  const [routeEnd, setRouteEnd] = useState(null);
  const [isRoutingMode, setIsRoutingMode] = useState(false);
  const [routeDestination, setRouteDestination] = useState(null);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    if (!isRoutingMode) {
      setRouteStart(null);
      setRouteEnd(null);
    }
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

  // Determine the height of the sheet based on the view
  const sheetHeightClass = selectedLocation ? 'h-[85vh] sm:h-[600px]' : 'h-[50vh] sm:h-[600px]';

  return (
    <div className="relative w-full h-screen bg-[#f8fafc] overflow-hidden font-sans">
      
      {/* Background Map View */}
      <div className="absolute inset-0 transition-transform duration-500 ease-in-out">
        <CampusMap 
          locations={locations} 
          selectedLocation={selectedLocation} 
          onMarkerClick={setSelectedLocation} 
          routeStart={routeStart}
          routeEnd={routeEnd}
        />
      </div>
      
      {/* Search Bar - hidden when viewing details on mobile, or in routing mode */}
      <div className={`transition-opacity duration-300 ${selectedLocation || isRoutingMode ? 'opacity-0 pointer-events-none sm:opacity-100 sm:pointer-events-auto' : 'opacity-100'}`}>
        {!isRoutingMode && (
          <SearchBar 
            locations={locations} 
            onSelectLocation={handleLocationSelect} 
          />
        )}
      </div>

      {/* Directions Search UI */}
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
      
      {/* The Master Bottom Sheet / Side Panel */}
      <BottomSheet isOpen={true} heightClass={sheetHeightClass}>
        <AnimatePresence mode="wait">
          {!selectedLocation ? (
            <motion.div
              key="list"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <LocationList 
                locations={locations} 
                onSelect={setSelectedLocation} 
              />
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
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
      
      {/* Desktop overlay button to close details */}
      {selectedLocation && (
        <button 
          onClick={() => setSelectedLocation(null)}
          className="hidden sm:flex absolute top-6 left-6 z-[1000] bg-white text-gray-800 px-5 py-3 rounded-full shadow-lg font-bold hover:bg-gray-50 active:scale-95 transition-all items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Back to Map
        </button>
      )}

    </div>
  );
};

export default MapPage;
