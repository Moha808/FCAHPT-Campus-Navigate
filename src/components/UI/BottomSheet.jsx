import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BottomSheet = ({ children, isOpen, heightClass = 'h-[60vh]' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[1000] overflow-hidden flex flex-col sm:max-w-md sm:left-4 sm:right-auto sm:bottom-4 sm:rounded-3xl sm:h-auto sm:max-h-[80vh] border border-white/20 ${heightClass}`}
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center py-4 cursor-grab active:cursor-grabbing sm:hidden shrink-0">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar pb-safe">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
