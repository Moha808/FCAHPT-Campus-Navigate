import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomSheet = ({ children, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="absolute bottom-0 left-0 right-0 z-[1000] bg-white rounded-t-[2rem] shadow-[0_-8px_40px_rgba(0,0,0,0.15)] overflow-hidden
                     sm:bottom-4 sm:left-4 sm:right-auto sm:rounded-3xl sm:w-[400px] sm:max-h-[85vh]"
        >
          {/* Drag handle – mobile only */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 bg-gray-200 rounded-full" />
          </div>

          <div className="overflow-y-auto max-h-[60vh] sm:max-h-[85vh]">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
