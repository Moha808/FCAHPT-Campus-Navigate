import React from 'react';
import { X, Navigation, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RoutingPanel = ({ isOpen, onClose, destination, locations, onSelectStart }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="absolute top-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-[400px] z-[2000] bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
          <div className="p-4 bg-brand-50 flex items-center justify-between border-b border-brand-100">
            <div className="flex items-center text-brand-800 font-bold truncate pr-4">
              <Navigation className="w-5 h-5 mr-2 shrink-0" />
              <span className="truncate">Directions to {destination?.name}</span>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-brand-100 rounded-full transition-colors text-brand-600 shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">Select Starting Point</h3>
            <div className="space-y-2">
              {locations.filter(loc => loc.id !== destination?.id).map(loc => (
                <button
                  key={loc.id}
                  onClick={() => onSelectStart(loc)}
                  className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center border border-transparent hover:border-gray-200"
                >
                  <div className={`w-8 h-8 rounded-full ${loc.color} flex items-center justify-center text-white shrink-0 mr-3 shadow-sm`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-800 text-sm">{loc.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{loc.category}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoutingPanel;
